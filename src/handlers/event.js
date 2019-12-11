const { readdirSync } = require("fs");

module.exports = client => {
  const load = dir => {
    const events = readdirSync(`./src/events/${dir}`).filter(d =>
      d.endsWith(".js")
    );
    for (const file of events) {
      const event = require(`../events/${dir}/${file}`);
      const eventName = file.split(".")[0]; // without .js
      client.on(eventName, event.bind(null, client));
    }
  };
  ["client", "guild"].forEach(x => load(x));
};
