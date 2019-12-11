const { readdirSync } = require("fs");

module.exports = client => {
  const load = dir => {
    const commandDirs = readdirSync(`./src/commands/${dir}`).filter(d =>
      d.endsWith(".js")
    );
    for (const file of commandDirs) {
      const command = require(`../commands/${dir}/${file}`);
      client.commands.set(command.name, command);
    }
  };
  ["misc", "moderation", "music", "owner"].forEach(x => load(x));
};
