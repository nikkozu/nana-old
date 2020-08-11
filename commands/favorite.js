exports.run = async (client, msg, args, color) => {
  if (!msg.channel.nsfw)
    return msg.channel
      .send(`NSFW channel please.`)
      .then(msg => msg.delete({ timeout: 5000 }));
  let nick =
    msg.member.nickname !== null
      ? `${msg.member.nickname}`
      : msg.author.username;

  msg.channel.send(`Sorry **${nick}** but for the time being, favorite commands can only be accessed via **Nana Beta** on nana's server\n${client.config.INVITE}`);
};

exports.conf = {
  aliases: ["favorites", "fav"],
  cooldown: 3
};

exports.help = {
  name: "favorite",
  description: "Safe your favorite doujin ID",
  usage: ["favorite add <BookID>", "favorite delete <BookID>"]
};
