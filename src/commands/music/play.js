const ytdl = require('ytdl-core-discord');
const ytsr = require('ytsr');

module.exports = {
  name: 'play',
  description: 'Play a song',
  aliases: ['pplay', 'p'],
  usage: '[command name]',
  cooldown: 2,
  async execute(message, args) {
    if (!message.member.voice.channel) {
      return await message.channel.send(
        'You have to be in a voice channel to play a song.'
      );
    }

    if (!args[0])
      return message.channel.send('Please provide a url or a search term.');

    const isValidURL = ytdl.validateURL(args[0]);

    let songInfo;
    if (isValidURL) {
      try {
        // User requested song with url - fetch songInfo from yt.

        const info = await ytdl.getInfo(args[0]);
        songInfo = {
          url: args[0],
          title: info.videoDetails.title,
        };
      } catch (error) {
        console.error('error while getting info from youtube:', error);
        return await message.channel.send(
          'Error getting song info from youtube...'
        );
      }
    } else {
      try {
        // User requested song using search terms - search youtube for result info.

        const fullSearchTerm = args.join(' ');
        const top5SearchResults = await ytsr(fullSearchTerm, { limit: 50 });
        const firstVideoSearchResult = top5SearchResults.items.find(
          (item) => item.type === 'video'
        );
        if (!firstVideoSearchResult)
          return await message.channel.send(
            'Could not find a song, skipping this request...'
          );

        songInfo = {
          url: firstVideoSearchResult.url,
          title: firstVideoSearchResult.title,
        };
      } catch (error) {
        console.error('error while searching youtube:', error);
        return await message.channel.send(
          'Error fetching song from youtube...'
        );
      }
    }

    const data = message.client.activeVoice.get(message.guild.id) || {};

    // Create and save the connection if it does not exist.
    if (!data.connection)
      data.connection = await message.member.voice.channel.join();
    if (!data.queue) data.queue = [];
    data.guildID = message.guild.id;

    data.queue.push({
      songTitle: songInfo.title,
      requester: message.author.tag,
      url: songInfo.url,
      announceChannel: message.channel.id,
    });

    // We need to save here too probably.
    // message.client.activeVoice.set(message.guild.id, data);

    if (!data.dispatcher) {
      data.dispatcher = await play(message.client, data);
    } else {
      await message.channel.send(
        `Added to Queue: ${songInfo.title} | Requested by: ${message.author.tag}`
      );
    }

    message.client.activeVoice.set(message.guild.id, data);
  },
};

async function play(client, data) {
  const channelToAnnounceIn = await client.channels.fetch(
    data.queue[0].announceChannel
  );
  await channelToAnnounceIn.send(
    `Now Playing: **${data.queue[0].songTitle}** | Requested By ${data.queue[0].requester}`
  );

  const stream = await ytdl(data.queue[0].url);

  data.dispatcher = data.connection.play(stream, {
    type: 'opus',
    quality: 'highestaudio',
    // highWaterMark: 1024 * 1024 * 10, this option made it not possible to !skip
    volume: 2,
  });
  //data.dispatcher.guildID = data.guildID;

  data.dispatcher.on('finish', () => {
    finish(client, data);
  });

  /*await new Promise((resolve, reject) => {
    data.dispatcher.on('start', () => {
      console.log('started');
      resolve();
    });
    data.dispatcher.on('error', reject);
  });*/

  return data.dispatcher;
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

    const channelToAnnounceIn = await client.channels.fetch(
      playedSong.announceChannel
    );
    channelToAnnounceIn.send('No songs left in queue, stopping the music...');
  }
}

const isUrl = (url) => {
  return url.includes('youtube.com/') || url.includes('youtu.be/');
};
