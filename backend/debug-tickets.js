const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
   const User = require('./models/User');
   const Ticket = require('./models/Ticket');
   const Club = require('./models/Club');
   
   const ticket = await Ticket.findOne({status: 'pending'}).populate({path: 'event', populate: {path: 'club'}});
   if (!ticket) {
      console.log('No pending ticket found');
      process.exit(0);
   }
   
   const club = ticket.event.club;
   const president = await User.findById(club.president);
   
   if (!president) {
      console.log('Valid President user not found for club:', club._id);
      process.exit(0);
   }
   
   const token = jwt.sign({ id: president._id, role: 'president' }, process.env.JWT_SECRET, { expiresIn: '1d' });
   
   try {
     console.log('Fetching tickets for club:', club._id);
     
     const resFetch = await fetch(`http://localhost:5000/api/tickets/club/${club._id}`, {
       headers: { Authorization: `Bearer ${token}` }
     });
     
     const body = await resFetch.json();
     if (!resFetch.ok) throw new Error(JSON.stringify(body));
     
     console.log('SUCCESS API /club/:clubId, fetched', body.data.length, 'tickets');
     
     console.log('Approving ticket:', ticket._id);
     const resApprove = await fetch(`http://localhost:5000/api/tickets/${ticket._id}/approve`, {
         method: 'PUT',
         headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
     });
     const approveBody = await resApprove.json();
     if (!resApprove.ok) throw new Error(JSON.stringify(approveBody));
     
     console.log('SUCCESS API approve:', resApprove.status);
     
     // Fetch again
     console.log('Fetching tickets AGAIN...');
     const resFetch2 = await fetch(`http://localhost:5000/api/tickets/club/${club._id}`, {
         headers: { Authorization: `Bearer ${token}` }
     });
     const body2 = await resFetch2.json();
     if (!resFetch2.ok) throw new Error(JSON.stringify(body2));
     console.log('SUCCESS API fetch 2:', body2.data.length);
     
   } catch (e) {
     console.log('ERROR IS:', e.message);
   }
   process.exit(0);
}).catch(console.log);
