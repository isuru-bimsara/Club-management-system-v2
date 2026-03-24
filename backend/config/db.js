const mongoose = require('mongoose');
const dns = require('dns');

// Force Node.js to use Google DNS for resolving SRV records, 
// bypassing potential local router DNS issues (ECONNREFUSED).
dns.setServers(['8.8.8.8', '1.1.1.1']);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;