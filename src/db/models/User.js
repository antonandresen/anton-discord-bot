const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const Schema = mongoose.Schema;

// Create a schema.
const userSchema = new Schema({
  _id: {
    type: String,
    default: uuidv4,
  },
  discordId: {
    type: String,
    required: true,
  },
});

userSchema.set('toJSON', {
  virtuals: true,
});

// Create a model.
const User = mongoose.model('user', userSchema);

// Export the model.
module.exports = User;
