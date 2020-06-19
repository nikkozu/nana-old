const Discord = require("discord.js");

exports.run = async (client, message, args, color) => {
  let start = Date.now();
  message.channel.send(":ping_pong:").then(message => {
    message.delete();
    let diff = (Date.now() - start).toLocaleString();
    let API = client.ws.ping.toFixed();
    let embed = new Discord.MessageEmbed()
      .setTitle(`:ping_pong: Pong!`)
      .setColor(color)
      .addField("Latency", `${diff}ms`, true)
      .addField("API", `${API}ms`, true);
    message.channel.send(embed);
  });
};

exports.conf = {
  aliases: ["pang", "peng", "pong"],
  cooldown: "10"
};

exports.help = {
  name: "ping",
  description: "Ping the bot to see if there are latecny issues.",
  usage: "{prefix}ping"
};
