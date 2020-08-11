const { MessageEmbed } = require("discord.js");

exports.run = async (client, msg, args, color) => {
  if (!msg.channel.nsfw)
    return msg.channel
      .send(`NSFW channel please.`)
      .then(msg => msg.delete({ timeout: 5000 }));
  let res = await client.embeds.getById(args[0]);
  let type = args[1];
  let embed = await client.embeds.download(res, type);
  msg.channel.send(embed);
};

exports.conf = {
  aliases: ["dl"],
  cooldown: "10"
};

exports.help = {
  name: "download",
  description: "Download nHentai manga",
  usage: "download <Book_ID>"
};
