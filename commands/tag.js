const nHentaiAPI = require("nana-api");
let api = new nHentaiAPI();

exports.run = async (client, msg, args, color) => {
  if (!msg.channel.nsfw)
    return msg.channel
      .send(`NSFW channel please.`)
      .then(msg => msg.delete({ timeout: 5000 }));
  if (!args[0])
    return msg.channel
      .send(
        `the command you are using is incorrect\nExample: \`nh tag <Tag> [language]\``
      )
      .then(msg => msg.delete({ timeout: 10000 }));
  let nick =
    msg.member.nickname !== null
      ? `${msg.member.nickname}`
      : msg.author.username;

  let tag = args[0];
  // if (tag.match(/loli|shota/gi)) return msg.channel.send("Banned Tag");
  let lang = args[1];
  if (!lang) lang = "english";
  if (lang == "ch") {
    lang = "chinese";
  } else if (lang == "en") {
    lang = "english";
  } else if (lang == "jp") {
    lang = "japanese";
  }
  if (!client.config.LANG.includes(lang.toLowerCase()))
    return msg.channel
      .send("Available langauge is `English`, `Japanese` & `Chinese`")
      .then(msg => msg.delete({ timeout: 5000 }));

  let numPages = await api.tag(tag);
  if (numPages.results.length == 0)
    return msg.channel.send(`No doujin found with tag \`${tag}\``);
  // console.log(numPages)
  if (!numPages.num_pages) {
    let query = numPages.results.filter(x => x.language == lang.toLowerCase());
    let rand = client.util.getRandInt(query.length);
    await client.embeds.getInfoEmbed(query[rand].id, msg);
    return;
  }
  let id = await api.tag(tag, client.util.getRandInt(numPages.num_pages));
  let langs = id.results.map(x => x.language == lang.toLowerCase() && x.id);
  let query = id.results.find(x => x.language == lang.toLowerCase()).id;
  await client.embeds.getInfoEmbed(query, msg);
};

exports.conf = {
  aliases: [],
  cooldown: "10"
};

exports.help = {
  name: "tag",
  description: "Get doujin by tag you provided",
  usage: ["tag <Doujin Tag>", "tag Milf", "tag Yaoi <english/japanese/chinese>"]
};
