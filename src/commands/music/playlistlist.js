const ytdl = require('ytdl-core-discord');
const {
  models: { Playlist },
} = require('../../db');

module.exports = {
  name: 'playlistlist',
  description: 'Play a playlist',
  aliases: ['pplaylistlist', 'pll', 'pllist'],
  usage: '[command name]',
  cooldown: 2,
  async execute(message, args) {
    const [playlistName] = args;

    if (!playlistName)
      return message.channel.send('Please provide a playlist name...');

    // Fetch playlist, and make sure playlist exists
    const playlist = await Playlist.findOne({
      name: playlistName,
    });
    if (!playlist)
      return message.channel.send(
        `Playlist with name **${playlistName}** does not exist...`
      );

    // List the playlist
    const msg = playlist.songLinks.reduce((resultMsg, msg, index) => {
      return (resultMsg += `**${index + 1}**. ${msg} \n`);
    }, '');
    message.channel.send(msg);
  },
};
