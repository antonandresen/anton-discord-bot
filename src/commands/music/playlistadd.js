const ytdl = require('ytdl-core-discord');
const {
  models: { Playlist },
} = require('../../db');

module.exports = {
  name: 'playlistadd',
  description: 'Add song to music playlist',
  aliases: ['pplaylistadd', 'pladd'],
  usage: '[command name]',
  cooldown: 2,
  async execute(message, args) {
    const [playlistName, songUrl] = args;

    if (!playlistName)
      return message.channel.send('Please provide a playlist name...');

    if (!songUrl) return message.channel.send('Please provide a song url...');

    const isValidURL = ytdl.validateURL(songUrl);
    if (!isValidURL)
      return message.channel.send('Please provide a **valid** song url...');

    // Fetch playlist, and make sure playlist exists
    const playlist = await Playlist.findOne({
      name: playlistName,
    });
    if (!playlist)
      return message.channel.send(
        `Playlist with name **${playlistName}** does not exist...`
      );

    // Make sure its the user that created the playlist that's adding the song.
    const creatorIsTryingToAddSong = playlist.creatorId === message.dbUser.id;
    if (!creatorIsTryingToAddSong)
      return message.reply(
        `You don't have permission to add song to this playlist...`
      );

    const songTitle = (await ytdl.getInfo(songUrl)).videoDetails.title;

    // Make sure song isn't already added to playlist.
    if (playlist.songLinks.includes(songUrl))
      return message.reply(
        `You have already added **${songTitle}** to the **${playlistName}** playlist...`
      );

    // All is fine, add song to the playlist
    playlist.songLinks.push(songUrl);
    await playlist.save();

    message.channel.send(`**${songTitle}** added to **${playlistName}**...`);
  },
};
