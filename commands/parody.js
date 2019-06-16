const nHentaiAPI = require('nhentai-api-js');
let api = new nHentaiAPI();

exports.run = async (client, msg, args, color) => {
    if (!msg.channel.nsfw) return msg.channel.send(`NSFW channel please.`).then(msg => msg.delete(5000));
  
    let res = await api.parody(args[0]);
}

exports.conf = {
  aliases: []
}

exports.help = {
  name: "parody"
}