const {
  models: { Playlist },
} = require('../../db');

module.exports = {
  name: 'playlistcreate',
  description: 'Create music playlist',
  aliases: ['pplaylistcreate', 'plcreate', 'plcr'],
  usage: '[command name]',
  cooldown: 2,
  async execute(message, args) {
    const playlistName = args[0];

    // Provide playlist name
    if (!playlistName)
      return message.channel.send('Please provide a playlist name...');

    // Make sure playlist does not exist
    const playlistAlreadyExists = await Playlist.findOne({
      name: playlistName,
    });
    if (playlistAlreadyExists)
      return message.channel.send(
        `Playlist with name **${playlistName}** already exists. Pick another name...`
      );

    // All is fine, create the playlist
    const newPlaylist = new Playlist({
      creatorId: message.dbUser.id,
      creatorDiscordId: message.dbUser.discordId,
      name: playlistName,
    });
    await newPlaylist.save();

    message.channel.send(`**${playlistName}** playlist created...`);
  },
};
