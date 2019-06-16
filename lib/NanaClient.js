const { Client } = require("discord.js");
const NanaEmbeds = require("./NanaEmbeds");

class Nana extends Client {
    
    constructor(opt){
        super(opt);

        this.config = require("../config");
        this.util = require("./NanaUtils");
        this.embeds = new NanaEmbeds(this);
        this.nHlogo = 'https://cdn.discordapp.com/attachments/466964106692395008/580378765419347968/icon_nhentai.png';
    }
}

module.exports = Nana;
