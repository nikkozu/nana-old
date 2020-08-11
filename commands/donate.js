const Discord = require("discord.js");
const pkg = require("../package.json");

exports.run = async (client, msg, args, color) => {
  const app = await client.fetchApplication();

  let embed = new Discord.MessageEmbed()
    .setColor(color)
    .setDescription(
      `**${msg.member.user.tag}** Welcome to donation page, you can support my creator on [Arxist](https://arxist.com/tip/masami) or [Patreon](https://patreon.com/masami) or you can send a message to ${app.owner.tag}.\n\n**Thank You**`
    )
    .setFooter(`© Nana | ${pkg.version}`);
  msg.channel.send(embed);
};

exports.conf = {
  aliases: ["donation"]
};

exports.help = {
  name: "donate",
  description: "Help my creator to buy me a VPS",
  usage: "donate"
};
