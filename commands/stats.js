const { version } = require("discord.js");
const pkg = require("../package.json");

exports.run = async (client, msg, args) => {
    const uptime = client.util.parseDur(client.uptime);
    const botVersion = pkg.version;

    msg.channel.send(`\`\`\`asciidoc
Mem. Usage :: ${Math.floor(process.memoryUsage().heapUsed/1048576)} MB
Uptime     :: ${uptime}
WS Ping    :: ${client.ping.toFixed(2)}ms
Users      :: ${client.users.size.toLocaleString()}
Servers    :: ${client.guilds.size.toLocaleString()}
Channels   :: ${client.channels.size.toLocaleString()}
Bot Vers.  :: ${botVersion}
Discord.js :: v${version}
Node       :: ${process.version}\`\`\``)
}

exports.conf = {
    aliases: [],
    cooldowns: "10"
}

exports.help = {
    name: "stats",
    description: "Show bot status",
    usage: "stats"
}