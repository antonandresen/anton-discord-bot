module.exports = async (client, reaction, user) => {
  if (user.bot) return;

  const { message } = reaction;
  const guildId = message.guild.id;
  const userId = user.id;

  // fetch some data.
  const voiceData = client.activeVoice.get(guildId) || {};
  if (!voiceData) return console.error('No voicedata, weird.');

  const songInfos =
    voiceData.activePicks && voiceData.activePicks.get(message.id);
  if (!songInfos) return console.error('No songInfos, weird.');

  if (songInfos[0].userId !== userId) return;

  // Everything in order, get correct url
  const emoteIndex = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'].findIndex(
    (emoji) => emoji === reaction.emoji.name
  );
  // User reacted with other emoji.
  if (emoteIndex === -1) {
    return console.log('user reacted with invalid emoji.');
  }

  // Find a message from the correct user (hacky)
  const messages = await message.channel.messages.fetch({ limit: 100 });
  const userMessage = messages.find((msg) => msg.author.id === userId);
  if (!userMessage) return;

  // delete the active pick.
  client.activeVoice.get(guildId).activePicks.delete(message.id);

  // call !play command manually with correct data.
  const playCommand = client.commands.get('play');
  playCommand.execute(userMessage, [songInfos[emoteIndex].url]);
};
