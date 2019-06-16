const { RichEmbed } = require("discord.js");
const nHentaiAPI = require('nhentai-api-js');
let api = new nHentaiAPI();

exports.run = async (client, msg, args, color) => {
    const res = await api.g(args[0]);
    const embed = new RichEmbed()
    .setColor(color)
    .setURL(`https://dl.nhent.ai/dl/${res.id}`)
    .setTitle(`Download: ${res.title.pretty}`)
    .setDescription(`Click the link above to start downloading \`${res.title.pretty}\``)
    msg.channel.send(embed);
}

exports.conf = {
  aliases: ['dl'],
  cooldown: '10'
}

exports.help = {
  name: 'download',
  description: 'Download nHentai manga',
  usage: 'download <Book_ID>'
}
