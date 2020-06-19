const pkg = require("../package.json");
const axios = require("axios");

module.exports = async client => {
  const version = pkg.version;

  const users = await client.util.getShardTotal("users.cache.size");
  const channels = await client.util.getShardTotal("channels.cache.size");
  const guilds = await client.util.getShardTotal("guilds.cache.size");

  console.log(
    `${client.user.username} Preparing to playing with ${users} users, in ${channels} channels of ${guilds} guilds...`
  );

  client.setInterval(async () => {
    let userFormat = client.util.nFormatter(users);
    let guildFormat = client.util.nFormatter(await client.util.getShardTotal("guilds.cache.size"));

    let status = [
      `with ${userFormat} users`,
      `Bot v${version}`,
      `in ${guildFormat} server 🎉`,
      `Help me to buy a VPS, please | nh donate`,
      `Ara ara ara`,
      `now with downloader | nh dl 177013`
    ];
    let rand = client.util.getRandInt(status.length);

    client.user.setActivity(status[rand], { type: "PLAYING" });
  }, 6e4);

  client.setInterval(() => {
    axios.post(
      `https://discord.bots.gg/api/v1/bots/${client.user.id}/stats`,
      {
        guildCount: guilds
      },
      {
        headers: {
          Authorization: process.env.DBGG_TOKEN
        }
      }
    );
  }, 18e5);
};
