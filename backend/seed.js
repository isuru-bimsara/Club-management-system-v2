const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Admin = require('./models/Admin');
const User = require('./models/User');

const MONGO_URI = 'mongodb+srv://pawanSachintha:pawan2002@cluster0.pyl06ad.mongodb.net/sliit_events?retryWrites=true&w=majority&appName=Cluster0';

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB Connected');

    // 1. Admin : admin@sliit.lk Password : Admin@123 Name : SLIIT Event
    let admin = await Admin.findOne({ email: 'admin@sliit.lk' });
    if (!admin) {
      admin = new Admin({
        name: 'SLIIT Event',
        email: 'admin@sliit.lk',
        password: 'Admin@123',
        role: 'superadmin'
      });
      await admin.save();
      console.log('Admin user created');
    } else {
      console.log('Admin user already exists');
    }

    // 2. President : suma@sliit.lk Password : Suma@123 Name :SLIIT President
    let president = await User.findOne({ email: 'suma@sliit.lk' });
    if (!president) {
      president = new User({
        name: 'SLIIT President',
        email: 'suma@sliit.lk',
        password: 'Suma@123',
        studentId: 'ITPRES001', // Example student ID
        role: 'president',
        status: 'active'
      });
      await president.save();
      console.log('President user created');
    } else {
      console.log('President user already exists');
    }

    // 3. Student : user@sliit.lk Password : User@123 Name : Suma Perera
    let student = await User.findOne({ email: 'user@sliit.lk' });
    if (!student) {
      student = new User({
        name: 'Suma Perera',
        email: 'user@sliit.lk',
        password: 'User@123',
        studentId: 'ITSTU001', // Example student ID
        role: 'student',
        status: 'active'
      });
      await student.save();
      console.log('Student user created');
    } else {
      console.log('Student user already exists');
    }

    console.log('Data seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error with data seeding:', error);
    process.exit(1);
  }
};

seedData();
