const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
   const User = require('./models/User');
   const Admin = require('./models/Admin');
   const Ticket = require('./models/Ticket');
   const Club = require('./models/Club');
   
   // find president
   const president = await User.findOne({role: 'president'});
   if (!president) {
      console.log('No president user found');
      process.exit(0);
   }
   
   const token = jwt.sign({ id: president._id, role: 'president' }, process.env.JWT_SECRET, { expiresIn: '1d' });
   
   const axios = require('axios');
   try {
     const club = await Club.findOne({president: president._id});
     if(!club) {
        console.log('No club found for president');
        process.exit(0);
     }
     console.log('Fetching tickets for club:', club._id);
     const res = await axios.get(`http://localhost:5000/api/tickets/club/${club._id}`, {
       headers: { Authorization: `Bearer ${token}` }
     });
     console.log('SUCCESS API /club/:clubId, fetched', res.data.data.length, 'tickets');
     
     if (res.data.data.length > 0) {
        console.log('Approving ticket:', res.data.data[0]._id);
        const resApprove = await axios.put(`http://localhost:5000/api/tickets/${res.data.data[0]._id}/approve`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('SUCCESS API approve:', resApprove.status);
     }
     
   } catch (e) {
     console.log('ERROR:', e.response?.data || e.message);
   }
   process.exit(0);
}).catch(console.error);
