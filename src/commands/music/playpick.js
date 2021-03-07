const { Collection } = require('discord.js');
const ytdl = require('ytdl-core-discord');
const ytsr = require('ytsr');

module.exports = {
  name: 'playpick',
  description: 'Play a song and pick from options',
  aliases: ['pplaypick', 'pp'],
  usage: '[command name]',
  cooldown: 2,
  async execute(message, args) {
    if (!message.member.voice.channel) {
      return await message.channel.send(
        'You have to be in a voice channel to play a song.'
      );
    }

    if (!args[0]) return message.channel.send('Please provide a search term.');

    const isValidURL = ytdl.validateURL(args[0]);
    if (isValidURL)
      return message.channel.send(
        'Use the regular **!play** command when using a URL.'
      );

    try {
      // User requested song using search terms - search youtube for result info.

      const fullSearchTerm = args.join(' ');
      const top50SearchResults = await ytsr(fullSearchTerm, { limit: 50 });
      const allVideoSearchResults = top50SearchResults.items.filter(
        (item) => item.type === 'video'
      );

      if (!allVideoSearchResults.length)
        return await message.channel.send(
          'Could not find a song, skipping this request...'
        );

      // Make sure we get max 5 results.
      if (allVideoSearchResults.length > 5) allVideoSearchResults.length = 5;
      const songInfos = allVideoSearchResults.map(({ url, title }) => ({
        url,
        title,
        userId: message.author.id,
      }));

      const msgToSend = songInfos.reduce((currMsg, songInfo, index) => {
        return (currMsg += `${index + 1}. **${songInfo.title}**\n`);
      }, '');

      // Send message with songs and reacts.
      const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'];
      const userPicksSongMessage = await message.channel.send(msgToSend);

      //Save here.
      const voiceData = message.client.activeVoice.get(message.guild.id) || {};
      if (!voiceData.activePicks) voiceData.activePicks = new Collection();
      voiceData.activePicks.set(userPicksSongMessage.id, songInfos);
      message.client.activeVoice.set(message.guild.id, voiceData);

      // Add the reactions
      for (let i = 0; i < songInfos.length; i++) {
        await userPicksSongMessage.react(emojis[i]);
      }
    } catch (error) {
      console.error('error during playpick:', error);
      return await message.channel.send('Error fetching song from youtube...');
    }
  },
};
