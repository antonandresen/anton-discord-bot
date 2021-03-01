const ytdl = require('ytdl-core-discord');

/**
 * Class properties:
 * client - Discord.js client
 * options - Options for MusicPlayer
 * voiceConnections - object for storing voiceConnections { guildId: voiceConnection}
 */
export class MusicPlayer {
  /**
   *
   * @param {Object} client - Discord.js client
   * @param {Object} options - Options for MusicPlayer [leaveOnEnd, leaveOnStop, leaveOnEmpty]
   */
  constructor(client, options) {
    this.client = client;
    this.options = options;
    this.voiceConnections = {};
    this.streamDispatchers = {};
    this.songQueues = {};
    this.isConnecteds = {};
  }

  /**
   * Initialize song queue and play song
   * @param {*} voiceChannel
   * @param {*} song
   * @param {*} requestedBy
   * @param {*} options
   */
  async play(voiceChannel, song, options) {
    const guildId = voiceChannel.guild.id;
    // If we are not connected to voice - then connect.
    const currentConnection = this.isConnected(guildId)
      ? this.voiceConnections[guildId]
      : await voiceChannel.join();

    // Initialize queue and add song to queue
    this.songQueues[guildId] = [];
    this.addToQueue(guildId, song);

    // Player already playing, we're done here.
    if (isPlaying(guildId)) {
      return song.announceChannel.send(
        `Added to Queue: ${song.title} | Requested by: ${song.requestedBy}`
      );
    }

    // No song playing, let's play the one we just added.
    await this.playSong(guildId, song);
  }

  // Private func
  async playSong(guildId, song) {
    song.announceChannel.send(
      `Now Playing: **${song.title}** | Requested By ${song.requestedBy}`
    );

    const connection = this.voiceConnections[guildId];
    const stream = await ytdl(song.url);

    // Play song
    const dispatcher = await connection.play(stream, {
      type: 'opus',
      quality: 'highestaudio',
      highWaterMark: 1024 * 1024 * 10,
    });

    dispatcher.once('finish', () => {
      const queue = this.getQueue[guildId]

      if(queue.length) {
        const nextSong = queue.shift()
        return await this.playSong(guildId, nextSong)
      }


    });

    // Save dispatcher.
    this.streamDispatchers[guildId] = dispatcher;
  }

  addToQueue(guildId, song) {
    const queue = this.songQueues[guildId];
    queue.push(song);
  }

  isConnected(guildId) {
    return this.isConnecteds[guildId];
  }

  isPlaying(guildId) {
    return !!this.streamDispatchers[guildId];
  }

  getQueue(guildId) {
    return this.songQueues[guildId];
  }
}

/*playSong = async (player) => {
  queue = player.getQueue()
}*/
