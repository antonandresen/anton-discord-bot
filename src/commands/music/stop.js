const ytdl = require('ytdl-core');

module.exports = {
  name: 'stop',
  description: 'Stop playing songs',
  aliases: ['sstop', 'stopp'],
  usage: '[command name]',
  cooldown: 2,
  async execute(message, args) {
    if (!message.member.voice)
      return message.channel.send(
        'You have to be connected to the voice chat to stop the bot.'
      );

    if (!message.guild.me.voiceChannel)
      return message.channel.send('The bot is not playing music.');

    if (message.guild.me.voiceChannelID !== message.member.voiceChannelID)
      return message.channel.send(
        'You have to be connected to the voice chat to stop the bot.'
      );

    message.guild.me.voiceChannel.leave();
    message.channel.send('Stopping the music...');
  },
};
