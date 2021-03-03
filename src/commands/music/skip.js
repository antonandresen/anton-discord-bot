module.exports = {
  name: 'skip',
  description: 'Stop currently playing song',
  aliases: ['sskip', 'skipp'],
  usage: '[command name]',
  cooldown: 2,
  async execute(message, args) {
    const voiceData = message.client.activeVoice.get(message.guild.id) || {};

    if (!message.member.voice.channel)
      return message.channel.send(
        'You have to be connected to the voice chat to skip songs.'
      );

    if (!voiceData.connection)
      return message.channel.send('The bot is not playing music.');

    /*if (message.guild.me.voiceChannelID !== message.member.voiceChannelID)
      return message.channel.send(
        'You have to be connected to the voice chat to stop the bot.'
      );*/
    voiceData.dispatcher.end();
    return message.channel.send('Skipping...');
  },
};
