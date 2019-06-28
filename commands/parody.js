const nHentaiAPI = require('nhentai-api-js');
let api = new nHentaiAPI();

exports.run = async (client, msg, args, color) => {
    if (!msg.channel.nsfw) return msg.channel.send(`NSFW channel please.`).then(msg => msg.delete(5000));
    
    let input = args[0];
    let lang = args[1];
    if (!lang) lang = 'english';
    if (!client.config.LANG.includes(lang)) return msg.channel.send('Available langauge is \`English\`, \`Japanese\` & \`Chinese\`').then(msg => msg.delete(5000));
    if (lang == "ch") {
        lang = "chinese"
    } else if (lang == 'en') {
        lang = 'english'
    } else if (lang == 'jp') {
        lang = 'japanese'
    }
  
    let numPages = await api.search(input);
    let id = await api.search(input, client.util.getRandInt(numPages.num_pages));
    const res = await api.g(id.results.find(x => x.language == lang).id);
    await client.embeds.getInfoEmbed(res.id, msg);
}

exports.conf = {
  aliases: []
}

exports.help = {
  name: "parody",
  description: "Get random doujin with provide name and language",
  usage: 'parody <parody> <language>'
}
