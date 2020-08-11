const { Client } = require("discord.js-light");
const NanaEmbeds = require("./NanaEmbeds");
const NanaDatabase = require("./NanaDatabase");
const NanaFavorite = require("./NanaFavorite");
const NanaUtils = require("./NanaUtils");

class Nana extends Client {
  constructor(opt) {
    super(opt);

    this.config = require("../config");
    this.version = require("../package").version;
    this.util = new NanaUtils(this);
    this.embeds = new NanaEmbeds(this);
    this.database = new NanaDatabase(this);
    this.favorite = new NanaFavorite(this);
    this.nHlogo = "https://cdn.discordapp.com/attachments/466964106692395008/580378765419347968/icon_nhentai.png";
    this.mangadl = "https://mangadl.herokuapp.com/download/nhentai"
  }
}

module.exports = Nana;
