const ytdl = require('ytdl-core');

module.exports = {
  name: 'stop',
  description: 'Stop playing songs',
  aliases: ['sstop', 'stopp'],
  usage: '[command name]',
  cooldown: 2,
  async execute(message, args) {
    const voiceData = message.client.activeVoice.get(message.guild.id) || {};
    console.log({ voiceData });

    if (!message.member.voice)
      return message.channel.send(
        'You have to be connected to the voice chat to stop the bot.'
      );

    if (!voiceData.connection)
      return message.channel.send('The bot is not playing music.');

    /*if (message.guild.me.voiceChannelID !== message.member.voiceChannelID)
      return message.channel.send(
        'You have to be connected to the voice chat to stop the bot.'
      );*/

    message.client.activeVoice.delete(message.guild.id);
    const vc = voiceData.connection;
    if (vc) await vc.disconnect();
    message.channel.send('Stopping the music...');
  },
};
