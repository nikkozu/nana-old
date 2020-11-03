exports.run = async (client, msg, args, color) => {
  if (!msg.channel.nsfw || msg.channel.nsfw == false)
    return msg.channel
      .send(`NSFW channel please.`)
      .then(msg => msg.delete({ timeout: 5000 }));
  client.channels.fetch(msg.channel.id);

  let nick = msg.member.nickname || msg.author.username;
  if (args[0] == "add") {
    let bookId = args[1];
    let res = await client.embeds.getById(bookId);
    let info = client.embeds.getInfo(res);
    let favorite = await client.favorite.getUserFavoritID(msg.author.id);
    favorite = favorite.find(x => x.bookID == bookId);
    if (!favorite) {
      client.favorite.setUserFavoritID(msg.author.id, res.id);
      return msg.channel
        .send(`${nick} you have added **${res.title.pretty}** to **Favorite**`)
        .then(msg => msg.delete({ timeout: 7000 }));
    }
    return msg.channel
      .send(`${nick} this book ID has already in your **Favorite** list`)
      .then(msg => msg.delete({ timeout: 7000 }));
  }
  if (args[0] == "delete") {
    let bookId = args[1];
    let res = await client.embeds.getById(bookId);
    let info = client.embeds.getInfo(res);
    let favorite = await client.favorite.getUserFavoritID(msg.author.id);
    favorite = favorite.find(x => x.bookID == bookId);
    if (!favorite) {
      return msg.channel
        .send(`${nick} you don't have doujin with that ID`)
        .then(msg => msg.delete({ timeout: 7000 }));
    }

    client.favorite.deleteUserFavoritID(msg.author.id, bookId);
    return msg.channel
      .send(
        `${nick} your favorite of **${res.title.pretty}** has been deleted from **Favorite**`
      )
      .then(msg => msg.delete({ timeout: 5000 }));
  }
  if (args[0] == "look") {
    try {
      var member =
        msg.mentions.members.first() || msg.guild.members.get(args[1]);
      await client.favorite.favoriteEmbed(msg, member.id);
    } catch (e) {
      if (e.message == "Cannot read property 'title' of undefined") {
        return msg.channel
          .send(`${member.user.username} don't have any doujin ID yet`)
          .then(msg => msg.delete({ timeout: 7000 }));
      }
    }
  }
  if (!args[0]) {
    try {
      await client.favorite.favoriteEmbed(msg, msg.author.id);
    } catch (e) {
      if (e.message == "Cannot read property 'title' of undefined") {
        return msg.channel
          .send(`${nick} you don't have any doujin ID yet`)
          .then(msg => msg.delete({ timeout: 7000 }));
      }
    }
  }
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
