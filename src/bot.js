const { Client, Collection } = require('discord.js');

const connectDiscordBot = () => {
  const client = new Client();
  ['commands', 'cooldowns', 'activeVoice'].forEach(
    (coll) => (client[coll] = new Collection())
  );
  ['command', 'event'].forEach((type) => require(`./handlers/${type}`)(client));

  client.login(process.env.test_token);
};

module.exports = {
  connectDiscordBot,
};
