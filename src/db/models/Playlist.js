const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const Schema = mongoose.Schema;

// Create a schema.
const PlaylistSchema = new Schema({
  _id: {
    type: String,
    default: uuidv4,
  },
  creatorId: {
    type: String,
    required: true,
  },
  creatorDiscordId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  songLinks: {
    type: Array,
    default: [],
  },
});

PlaylistSchema.set('toJSON', {
  virtuals: true,
});

// Create a model.
const Playlist = mongoose.model('playlist', PlaylistSchema);

// Export the model.
module.exports = Playlist;
