const { RichEmbed } = require("discord.js");
const nHentaiAPI = require('nhentai-api-js');
let api = new nHentaiAPI();

exports.run = async (client, msg, args, color) => {
    if (!msg.channel.nsfw) return msg.channel.send(`NSFW channel please.`).then(msg => msg.delete(5000));
    const res = await api.g(args[0]);
    let m = await msg.channel.send(client.embeds.getInfoEmbed(res));
  
    client.embeds.getEmoji(res, m, msg);
}

exports.conf = {
  aliases: [],
  cooldown: '15'
}

exports.help = {
  name: 'read',
  description: 'Read nHentai manga from Discord',
  usage: 'read <Book_ID>'
}