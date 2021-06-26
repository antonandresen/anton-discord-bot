const { Collection } = require('discord.js');
const {
  models: { User },
} = require('../../db');

module.exports = async (client, message) => {
  // Remove the embed links from messages
  if (message.author.bot) await message.suppressEmbeds(true);

  // MÅNSSON CHECKS
  if (message.author.id === '136919142174294016') {
    console.log('MÅNSSON TYPED');
    if (message.content.includes(':deaf_man:')) {
      await message.delete();
      return message.reply(
        'Njaaa månsson, dedär vet jag inte om jag riktigt går med på :))'
      );
    }
  }

  // Check if user exists, if it doesn't. add it.
  const user = await User.findOne({ discordId: message.author.id });
  if (!user) {
    const newUser = new User({
      discordId: message.author.id,
    });
    await newUser.save();
  }
  message.dbUser = user;

  if (!message.content.startsWith(process.env.prefix) || message.author.bot)
    return;

  // Setup command and args.
  const args = message.content.slice(process.env.prefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase();

  // Locate command with name or alias.
  const command =
    client.commands.get(commandName) ||
    client.commands.find(
      (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
    );

  if (!command) return;

  if (command.guildOnly && message.channel.type !== 'text') {
    return message.reply("I can't execute that command inside DMs!");
  }

  if (command.args && !args.length) {
    let reply = `You didn't provide any arguments, ${message.author}!`;

    if (command.usage) {
      reply += `\nThe proper usage would be: \`${process.env.prefix}${command.name} ${command.usage}\``;
    }

    return message.channel.send(reply);
  }

  if (!client.cooldowns.has(command.name)) {
    client.cooldowns.set(command.name, new Collection());
  }

  const now = Date.now();
  const timestamps = client.cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 3) * 1000;

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(
        `please wait ${timeLeft.toFixed(
          1
        )} more second(s) before reusing the \`${command.name}\` command.`
      );
    }
  }

  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply('there was an error trying to execute that command!');
  }
};
