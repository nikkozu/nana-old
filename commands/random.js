exports.run = async (client, msg, args, color) => {
  if (!msg.channel.nsfw)
    return msg.channel
      .send(`NSFW channel please.`)
      .then(msg => msg.delete({ timeout: 5000 }));
  let res = await client.embeds.getRandom();
  await client.embeds.getInfoEmbed(res.id, msg);
};

exports.conf = {
  aliases: [],
  cooldown: "15"
};

exports.help = {
  name: "random",
  description: "Get random nhentai book ID",
  usage: "random"
};
