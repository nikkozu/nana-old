const Discord = require("discord.js");
const nHentaiAPI = require("nana-api");
let api = new nHentaiAPI();

exports.run = async (client, msg, args, color) => {
  if (!msg.channel.nsfw)
    return msg.channel
      .send(`NSFW channel please.`)
      .then(msg => msg.delete({ timeout: 5000 }));

  // let patt = /^\d+$/;
  // if (patt.test(args[0]))
  //   return undefined;
  
  let lang = args[0].toLowerCase();
  if (lang == "ch") {
    lang = "chinese";
  } else if (lang == "en") {
    lang = "english";
  } else if (lang == "jp") {
    lang = "japanese";
  }
  if (!client.config.LANG.includes(lang))
    return msg.channel
      .send("Available langauge is `English`, `Japanese` & `Chinese`")
      .then(msg => msg.delete({ timeout: 5000 }));

  let numPages = await api.search(lang);
  let id = await api.search(lang, client.util.getRandInt(numPages.num_pages));
  const res = await api.g(
    id.results[client.util.getRandInt(id.results.length)].id.toString()
  );
  await client.embeds.getInfoEmbed(res.id, msg);
};

exports.conf = {
  aliases: ["lang"]
};

exports.help = {
  name: "language",
  description:
    "Search random nHentai manga from language. You can use alias language\nExample: en, ch, or jp.",
  usage: "language"
};
