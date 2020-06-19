const { version, MessageEmbed } = require("discord.js");
const pkg = require("../package.json");

exports.run = async (client, msg, args, color) => {
  const uptime = client.util.parseDur(client.uptime);
  const botVersion = pkg.version;
  const users = await client.util.getShardTotal("users.cache.size");
  const channels = await client.util.getShardTotal("channels.cache.size");
  const servers = await client.util.getShardTotal("guilds.cache.size");

  if (!args[0]) {
    msg.channel.send(`\`\`\`asciidoc
Mem. Usage :: ${Math.floor(process.memoryUsage().heapUsed / 1048576)} MB
Uptime     :: ${uptime}
WS Ping    :: ${client.ws.ping}ms
Users      :: ${users.toLocaleString()}
Servers    :: ${servers.toLocaleString()}
Channels   :: ${channels.toLocaleString()}
Bot Vers.  :: ${botVersion}
Discord.js :: v${version}
Node       :: ${process.version}\`\`\``);
  } else if (args[0] == "server") {
    if (!client.config.OWNERS.includes(msg.author.id)) return;

    let guildsCount = [];
    let servers = client.guilds.cache
      .array()
      .slice()
      .map(x => x)
      .sort((a, b) =>
        a.memberCount < b.memberCount
          ? 1
          : b.memberCount < a.memberCount
          ? -1
          : 0
      );
    for (var [i, x] of servers.entries()) {
      guildsCount.push(`\`${i + 1}\`. ${x.name} = \`${x.memberCount}\``);
    }

    guildsCount = client.util.chunk(guildsCount, 15);
    let page = 1;
    const embed = new MessageEmbed()
      .setColor(color)
      .setFooter(`Page ${page} of ${guildsCount.length}`)
      .setDescription(guildsCount[page - 1]);
    let m = await msg.channel.send(embed);

    // clear all reactions
    // client.setInterval(() => {
    //     m.clearReactions();
    // }, 120000);

    await m.react(`◀`);
    await m.react(`▶`);
    const backwardsFilter = (reaction, user) =>
      reaction.emoji.name === `◀` && user.id === msg.author.id;
    const forwardsFilter = (reaction, user) =>
      reaction.emoji.name === `▶` && user.id === msg.author.id;
    const backwards = m.createReactionCollector(backwardsFilter);
    const forwards = m.createReactionCollector(forwardsFilter);

    backwards.on("collect", r => {
      r.remove(msg.author.id);
      if (page === 1) return;
      page--;
      embed.setDescription(guildsCount[page - 1]);
      embed.setFooter(`Page ${page} of ${guildsCount.length}`);
      m.edit(embed);
    });

    forwards.on("collect", r => {
      r.remove(msg.author.id);
      if (page === guildsCount.length) return;
      page++;
      embed.setDescription(guildsCount[page - 1]);
      embed.setFooter(`Page ${page} of ${guildsCount.length}`);
      m.edit(embed);
    });
  }
};

exports.conf = {
  aliases: [],
  cooldowns: "10"
};

exports.help = {
  name: "stats",
  description: "Show bot status",
  usage: "stats"
};
