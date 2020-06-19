const { MessageEmbed } = require("discord.js");
const nHentaiAPI = require("nana-api");
let api = new nHentaiAPI();
const TYPE = {
  j: "jpg",
  p: "png",
  g: "gif"
};

exports.run = async (client, msg, args, color) => {
  if (!msg.channel.nsfw)
    return msg.channel
      .send(`NSFW channel please.`)
      .then(msg => msg.delete({ timeout: 5000 }));
  const res = await api.g(args[0].toString());
  let nhentURL = `https://hdl.rurafs.me/download/nhentai/${res.id}`;
  const embed = new MessageEmbed()
    .setTitle(res.title.pretty)
    .setURL(nhentURL.trim())
    .setThumbnail(
      `https://i.nhentai.net/galleries/${res.media_id}/1.${
        TYPE[res.images.cover.t]
      }`
    )
    .setColor(color)
    .setTimestamp()
    .setDescription(
      `To start download, click the doujin title above.\n\nFeel free to join [my server](https://discord.gg/X3yeKgN)`
    );
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
