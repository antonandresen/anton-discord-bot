const ytdl = require('ytdl-core-discord');
const {
  models: { Playlist },
} = require('../../db');

module.exports = {
  name: 'playlistplay',
  description: 'Play a playlist',
  aliases: ['pplaylistplay', 'plp', 'ppl'],
  usage: '[command name]',
  cooldown: 2,
  async execute(message, args) {
    const [playlistName, random] = args;

    const isRandom = random && random.toLowerCase() === 'r';

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

    const songList = isRandom
      ? randomize(playlist.songLinks)
      : playlist.songLinks;

    // Play all the songs from the playlist
    const playCommand = message.client.commands.get('play');
    for (let i = 0; i < songList.length; i++) {
      const songLink = songList[i];
      await playCommand.execute(message, [songLink]);
    }
  },
};

const randomize = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i);
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
};
