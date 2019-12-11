module.exports = client => {
  console.log(`${client.user.username} is connected...`);
  client.user.setActivity("Im alive!", {
    type: "STREAMING",
    url: "https://www.twitch.tv/antonosu"
  });
};
