const { MessageEmbed } = require("discord.js");
const nHentaiAPI = require("nana-api");
const TYPE = {
  j: "jpg",
  p: "png",
  g: "gif"
};

let api = new nHentaiAPI();

class NanaEmbeds {
  constructor(client) {
    this.client = client;
  }
  
  getRandom() {
    return api.random().then(res => res);
  }

  getById(id) {
    return api.g(id.toString()).then(res => res);
  }

  getInfo(res) {
    let json = {};

    json.title = res.title.pretty;
    json.link = `https://nhentai.net/g/${res.id}`;
    json.id = res.id;
    json.tag = res.tags
      .filter(x => x.type == "tag")
      .map(x => this.client.util.toPlural(x.name));
    json.category = res.tags
      .filter(x => x.type == "category")
      .map(x => this.client.util.toPlural(x.name));
    json.artist = res.tags
      .filter(x => x.type == "artist")
      .map(x => this.client.util.toPlural(x.name));
    json.parody = res.tags
      .filter(x => x.type == "parody")
      .map(x => this.client.util.toPlural(x.name));
    json.character = res.tags
      .filter(x => x.type == "character")
      .map(x => this.client.util.toPlural(x.name));
    json.cover = `https://i.nhentai.net/galleries/${res.media_id}/1.${
      TYPE[res.images.cover.t]
    }`;

    let lang = res.tags.filter(x => x.type == "language").map(x => x.name);
    if (lang[0] == "translated") {
      json.lang = this.client.util.toPlural(lang[1]);
    } else {
      json.lang = this.client.util.toPlural(lang[0]);
    }

    return json;
  }

  async getInfoEmbed(id, msg) {
    const embed = new MessageEmbed();
    let res = await this.getById(id);
    let info = this.getInfo(res);

    // console.log(info);
    embed.setAuthor("nHentai random generator", this.client.nHlogo);
    embed.setColor(this.client.config.COLOR);
    // embed.setThumbnail(thumb);
    embed.setTitle(`${res.title.pretty}`);
    embed.setDescription(
      `Made by: **${info.artist[0] ? info.artist.join(", ") : info.artist}**`
    );
    embed.setURL(`https://nhentai.net/g/${res.id}`);
    embed.setImage(info.cover);
    embed.setFooter(`React with 📖 to continue reading / ${res.id}`);
    embed.addField("Language", info.lang, true);
    if (info.parody[0])
      embed.addField(
        "Parody",
        info.parody[0] ? info.parody.join(", ") : info.parody,
        true
      );
    if (info.character[0])
      embed.addField(
        "Characters",
        info.character[0] ? info.character.join(", ") : info.character,
        true
      );
    if (info.category[0]) embed.addField("Categories", info.category, true);
    embed.addField("Pages", res.num_pages, true);
    if (info.tag[0])
      embed.addField("Tags", info.tag[0] ? info.tag.join(", ") : info.tag);
    let m = await msg.channel.send(embed);
    this.getEmoji(id, m, msg);
  }

  async getEmoji(id, m, msg) {
    let res = await this.getById(id);
    let info = this.getInfo(res);
    let pagination = 1;
    let doujin = [];
    let nick =
      msg.member.nickname !== null
        ? `${msg.member.nickname}`
        : msg.author.username;

    res.images.pages.forEach((page, i) => {
      doujin.push(
        `https://i.nhentai.net/galleries/${res.media_id}/${i + 1}.${
          TYPE[page.t]
        }`
      );
    });

    await m.react("💖");
    await m.react("📖");
    await m.react("💾");
    await m.react("♻");

    const deleteFilter = (reaction, user) =>
      reaction.emoji.name === `♻` && user.id === msg.author.id;
    const forwardsFilter = (reaction, user) =>
      reaction.emoji.name === `📖` && user.id === msg.author.id;
    const downloadFilter = (reaction, user) =>
      reaction.emoji.name === `💾` && user.id !== this.client.user.id;
    const favoritFilter = (reaction, user) =>
      reaction.emoji.name === `💖` && user.id === msg.author.id;
    const deletes = m.createReactionCollector(deleteFilter);
    const forwards = m.createReactionCollector(forwardsFilter);
    const download = m.createReactionCollector(downloadFilter);
    const favorit = m.createReactionCollector(favoritFilter);

    forwards.on("collect", async f => {
      m.delete();

      // read embed
      const read = new MessageEmbed();
      read.setAuthor("nHentai read", this.client.nHlogo);
      read.setColor(this.client.config.COLOR);
      read.setTitle(`${res.title.pretty}`);
      read.setDescription(
        `Made by: **${info.artist[0] ? info.artist.join(", ") : info.artist}**`
      );
      read.setURL(`https://nhentai.net/g/${res.id}`);
      read.setImage(doujin[pagination - 1]);
      read.setFooter(`Page ${pagination} of ${doujin.length} / ${res.id}`);
      let r = await msg.channel.send(read);
      return this.getRead(res, read, r, msg, pagination);
    });

    deletes.on("collect", d => {
      return m.delete();
    });

    download.on("collect", async d => {
      let embed = await this.download(res, "zip");
      msg.channel.send(embed);
    });

    favorit.on("collect", async f => {
      let favorite = await this.client.favorite.getUserFavoritID(msg.author.id);
      favorite = favorite.map(x => x.bookID);
      if (favorite.includes(res.id)) {
        this.client.favorite.deleteUserFavoritID(msg.author.id, res.id);
        return msg.channel
          .send(
            `${nick} your favorite of **${res.title.pretty}** has been deleted from **Favorite**`
          )
          .then(msg => msg.delete({ timeout: 5000 }));
      } else {
        this.client.favorite.setUserFavoritID(msg.author.id, res.id);
        return msg.channel
          .send(
            `${nick} you have added **${res.title.pretty}** to **Favorite**`
          )
          .then(msg => msg.delete({ timeout: 5000 }));
      }
    });
  }

  async getRead(res, read, r, msg, pagination) {
    let images = [];
    res.images.pages.forEach((page, i) => {
      images.push(
        `https://i.nhentai.net/galleries/${res.media_id}/${i + 1}.${
          TYPE[page.t]
        }`
      );
    });

    await r.react("⏪");
    await r.react("⬅");
    await r.react("➡");
    await r.react("⏩");
    await r.react("♻");

    const backwardsTenFilter = (reaction, user) =>
      reaction.emoji.name === `⏪` && user.id === msg.author.id;
    const backwardsFilter = (reaction, user) =>
      reaction.emoji.name === `⬅` && user.id === msg.author.id;
    const deleteFilter = (reaction, user) =>
      reaction.emoji.name === `♻` && user.id === msg.author.id;
    const forwardsFilter = (reaction, user) =>
      reaction.emoji.name === `➡` && user.id === msg.author.id;
    const forwardsTenFilter = (reaction, user) =>
      reaction.emoji.name === `⏩` && user.id === msg.author.id;
    const backwardsTen = r.createReactionCollector(backwardsTenFilter);
    const backwards = r.createReactionCollector(backwardsFilter);
    const deletes = r.createReactionCollector(deleteFilter);
    const forwards = r.createReactionCollector(forwardsFilter);
    const forwardsTen = r.createReactionCollector(forwardsTenFilter);

    backwardsTen.on("collect", bt => {
      if (pagination <= 5) return;
      pagination -= 5;
      read.setImage(images[pagination - 1]);
      read.setFooter(`Page ${pagination} of ${images.length} / ${res.id}`);
      r.edit(read);
    });

    backwards.on("collect", b => {
      if (pagination == 1) return;
      pagination--;
      read.setImage(images[pagination - 1]);
      read.setFooter(`Page ${pagination} of ${images.length} / ${res.id}`);
      r.edit(read);
    });

    forwards.on("collect", f => {
      if (pagination == images.length) return;
      pagination++;
      read.setImage(images[pagination - 1]);
      read.setFooter(`Page ${pagination} of ${images.length} / ${res.id}`);
      r.edit(read);
    });

    forwardsTen.on("collect", ft => {
      if (pagination + 5 >= images.length) return;
      pagination += 5;
      read.setImage(images[pagination - 1]);
      read.setFooter(`Page ${pagination} of ${images.length} / ${res.id}`);
      r.edit(read);
    });

    deletes.on("collect", d => {
      r.delete();
    });
  }

  async download(res, type) {
    let nhentURL = `${this.client.mangadl}/${res.id}/${
      type == "cbz" ? "cbz" : "zip"
    }`;
    const embed = new MessageEmbed()
      .setTitle(res.title.pretty)
      .setURL(encodeURI(nhentURL.trim()))
      .setThumbnail(this.getInfo(res).cover)
      .setColor(this.client.config.COLOR)
      .setTimestamp()
      .setDescription(
        `To start download, click the doujin title above.\n\nFeel free to join [my server](https://discord.gg/X3yeKgN)`
      );
    return embed;
  }
}

module.exports = NanaEmbeds;
