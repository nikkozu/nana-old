const { RichEmbed } = require("discord.js");
const nHentaiAPI = require('nhentai-api-js');
let api = new nHentaiAPI();

exports.run = async (client, msg, args, color) => {
    if (!msg.channel.nsfw) return msg.channel.send(`NSFW channel please.`).then(msg => msg.delete(5000));
    let res = await api.random();
    let m = await msg.channel.send(client.embeds.getInfoEmbed(res));
  
    client.embeds.getEmoji(res, m, msg);
}

exports.conf = {
  aliases: [],
  cooldown: '15'
}

exports.help = {
  name: 'random',
  description: 'Get random nhentai book ID',
  usage: 'random'
}