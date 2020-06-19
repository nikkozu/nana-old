const { MessageEmbed } = require("discord.js");

class NanaFavorite {
  constructor(client) {
    this.client = client;
  }

  setUserFavoritID(member, book) {
    return new Promise(async (fulfill, reject) => {
      try {
        let data = await this.client.database.db.run(
          "INSERT INTO favorit (userID, bookID) VALUES ($userID, $bookID);",
          {
            $userID: member,
            $bookID: book
          }
        );
        fulfill(data);
      } catch (err) {
        reject(err);
      }
    });
  }

  getUserFavoritID(member) {
    return new Promise(async (fulfill, reject) => {
      this.client.database.db.all(
        `SELECT bookID FROM favorit WHERE userID = "${member}"`,
        (err, res) => {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            fulfill(res);
          }
        }
      );
    });
  }

  deleteUserFavoritID(member, bookId) {
    return new Promise(async (fulfill, reject) => {
      this.client.database.db.all(
        `DELETE FROM favorit WHERE userID = "${member}" AND bookID = "${bookId}"`,
        (err, res) => {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            fulfill(res);
          }
        }
      );
    });
  }

  favoriteEmbed(msg, id = msg.author.id) {
    return new Promise(async (fulfill, reject) => {
      try {
        const embed = new MessageEmbed();
        let member = await msg.guild.members.fetch(id);
        let nick =
          member.nickname !== null
            ? `${member.nickname}`
            : member.user.username;
        // get Book ID
        let favorite = await this.client.favorite.getUserFavoritID(id);
        favorite = favorite.map(x => x.bookID).reverse();
        if (!favorite[0])
          return msg.channel
            .send(
              `Sorry, ${
                id == msg.author.id ? "you" : `**${nick}**`
              } doesn't have any favorite doujin ID yet.`
            )
            .then(msg => msg.delete({ timeout: 5000 }));
        // let favorite = getFavorite.reverse();
        // console.log(`${getFavorite}\n${favorite}`)

        let res = await this.client.embeds.getById(favorite[0]);
        let info = this.client.embeds.getInfo(res);

        embed.setAuthor(`${nick} favorite list`, member.user.avatarURL);
        embed.setTitle(`${info.title}`);
        embed.setDescription(
          `Made by: **${
            info.artist[0] ? info.artist.join(", ") : info.artist
          }**`
        );
        embed.setURL(`${info.link}`);
        embed.setImage(info.cover);
        embed.setColor(this.client.config.COLOR);
        embed.setFooter(`Page 1 of ${favorite.length} / ${info.id}`);
        let m = await msg.channel.send(embed);
        this.getFavoriteEmoji(favorite, embed, m, msg, member);

        fulfill();
      } catch (err) {
        console.log(err);
      }
    });
  }

  getFavoriteEmoji(id, embed, m, msg, member) {
    return new Promise(async (fulfill, reject) => {
      try {
        let pagination = 1;
        var info, res;

        await m.react("ℹ");
        await m.react("⬅");
        await m.react("➡");
        await m.react("♻");

        const infoFilter = (reaction, user) =>
          reaction.emoji.name === `ℹ` && user.id === msg.author.id;
        const backwardsFilter = (reaction, user) =>
          reaction.emoji.name === `⬅` && user.id === msg.author.id;
        const forwardsFilter = (reaction, user) =>
          reaction.emoji.name === `➡` && user.id === msg.author.id;
        const deleteFilter = (reaction, user) =>
          reaction.emoji.name === `♻` && user.id === msg.author.id;
        const infor = m.createReactionCollector(infoFilter);
        const backwards = m.createReactionCollector(backwardsFilter);
        const forwards = m.createReactionCollector(forwardsFilter);
        const deletes = m.createReactionCollector(deleteFilter);

        infor.on("collect", async i => {
          res = await this.client.embeds.getById(id[pagination - 1]);
          info = this.client.embeds.getInfo(res);

          await this.client.embeds.getInfoEmbed(info.id, msg);
        });

        backwards.on("collect", async b => {
          if (pagination == 1) return;
          pagination--;
          res = await this.client.embeds.getById(id[pagination - 1]);
          info = this.client.embeds.getInfo(res);

          embed.setTitle(`${info.title}`);
          embed.setDescription(
            `Made by: **${
              info.artist[0] ? info.artist.join(", ") : info.artist
            }**`
          );
          embed.setURL(`${info.link}`);
          embed.setImage(info.cover);
          embed.setColor(this.client.config.COLOR);
          embed.setFooter(`Page ${pagination} of ${id.length} / ${info.id}`);
          m.edit(embed);
        });

        forwards.on("collect", async f => {
          if (pagination == id.length) return;
          pagination++;
          res = await this.client.embeds.getById(id[pagination - 1]);
          info = this.client.embeds.getInfo(res);

          embed.setTitle(`${info.title}`);
          embed.setDescription(
            `Made by: **${
              info.artist[0] ? info.artist.join(", ") : info.artist
            }**`
          );
          embed.setURL(`${info.link}`);
          embed.setImage(info.cover);
          embed.setFooter(`Page ${pagination} of ${id.length} / ${info.id}`);
          m.edit(embed);
        });

        deletes.on("collect", d => {
          return m.delete();
        });

        fulfill();
      } catch (err) {
        reject(err);
      }
    });
  }
}

module.exports = NanaFavorite;
