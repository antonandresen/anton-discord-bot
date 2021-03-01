const ytdl = require('ytdl-core');

module.exports = {
  name: 'play',
  description: 'Play a song',
  aliases: ['pplay', 'p'],
  usage: '[command name]',
  cooldown: 2,
  async execute(message, args) {
    if (!message.member.voice) {
      return message.channel.send(
        'You have to be in a voice channel to play a song.'
      );
    }

    if (!args[0])
      return message.channel.send('Please provide a url or a search term.');

    const isValidURL = ytdl.validateURL(args[0]);

    if (!isValidURL)
      return message.channel.send('Please provide a **valid** url');

    const info = await ytdl.getInfo(args[0]);

    const data = message.client.activeVoice.get(message.guild.id) || {};

    // Create and save the connection if it does not exist.
    if (!data.connection)
      data.connection = await message.member.voice.channel.join();
    if (!data.queue) data.queue = [];
    data.guildID = message.guild.id;

    data.queue.push({
      songTitle: info.title,
      requester: message.author.tag,
      url: args[0],
      announceChannel: message.channel.id,
    });

    console.log('HELLO GAMING', data.queue[0]);

    if (!data.dispatcher) {
      play(message.client, data);
    } else {
      message.channel.send(
        `Added to Queue: ${info.title} | Requested by: ${message.author.tag}`
      );
    }

    message.client.activeVoice.set(message.guild.id, data);
  },
};

async function play(client, data) {
  const channelToAnnounceIn = await client.channels.fetch(
    data.queue[0].announceChannel
  );
  channelToAnnounceIn.send(
    `Now Playing ${data.queue[0].songTitle} | Requested By ${data.queue[0].requester}`
  );

  data.dispatcher = await data.connection.play(
    ytdl(data.queue[0].url, {
      type: 'opus',
      quality: 'highestaudio',
      highWaterMark: 1024 * 1024 * 10,
    })
  );
  //data.dispatcher.guildID = data.guildID;

  data.dispatcher.once('finish', () => {
    finish(client, data);
  });
}

async function finish(client, data) {
  const fetched = client.activeVoice.get(data.guildID);
  const playedSong = fetched.queue.shift();

  if (fetched.queue.length > 0) {
    client.activeVoice.set(data.guildID, fetched);

    play(client, fetched);
  } else {
    client.activeVoice.delete(data.guildID);

    const vc = data.connection;
    if (vc) await vc.disconnect();
  }
}
