const mongoose = require('mongoose');
const models = require('./models');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION_STRING, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log('MONGODB - Discord database connected');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = {
  connectDB,
  models,
};
