const { version, MessageEmbed } = require("discord.js");
const pkg = require("../package.json");

exports.run = async (client, msg, args, color) => {
  const uptime = client.util.parseDur(client.uptime);
  const botVersion = pkg.version;
  const users = client.users.cache.size;
  const channels = client.channels.cache.size;
  const servers = client.guilds.cache.size;

  msg.channel.send(`\`\`\`asciidoc
Mem. Usage :: ${Math.floor(process.memoryUsage().heapUsed / 1048576)} MB
Uptime     :: ${uptime}
WS Ping    :: ${client.ws.ping}ms
Users      :: ${users.toLocaleString()}
Servers    :: ${servers.toLocaleString()}
Channels   :: ${channels.toLocaleString()}
Bot Vers.  :: ${botVersion}
D.js-light :: v${version}
Node       :: ${process.version}\`\`\``);
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
