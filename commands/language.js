const Discord = require("discord.js");
const nHentaiAPI = require('nhentai-api-js');
let api = new nHentaiAPI();

exports.run = async (client, msg, args, color) => {
    if (!msg.channel.nsfw) return msg.channel.send(`NSFW channel please.`).then(msg => msg.delete(5000));
  
    let lang = args[0];
    if (lang != 'english' && lang != 'japanese' && lang != 'chinese') return msg.channel.send('Available langauge is \`English\`, \`Japanese\` & \`Chinese\`').then(msg => msg.delete(5000));
    
    let numPages = await api.search(lang);
    let id = await api.search(lang, client.util.getRandInt(numPages.num_pages));
    const res = await api.g(id.results[client.util.getRandInt(id.results.length)].id);
    let m = await msg.channel.send(client.embeds.getInfoEmbed(res));
  
    client.embeds.getEmoji(res, m, msg);
    // msg.channel.send(`https://nhentai.net/g/${res.results[client.util.getRandInt(res.results.length)].id}`);
};

exports.conf = {
  aliases: ['lang'],
  cooldown: '15'
}

exports.help = {
  name: "language",
  description: 'Search random nHentai manga from language.',
  usage: 'language'
}
