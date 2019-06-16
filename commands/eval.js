const { RichEmbed } = require("discord.js");
const { post } = require('snekfetch');

exports.run = async (client, msg, args, color) => {
  const embed = new RichEmbed()
  .setColor(color)
  .addField('Input', '```js\n' + args.join(" ") + '```')

  try {
    const code = args.join(" ");
    let evaled;
    if (code.includes(`token`)) {
      evaled = 'Mastah no Baka!!!';
    } else {
      evaled = eval(code);
    }

    if (typeof evaled !== "string")
    evaled = require('util').inspect(evaled, { depth: 0});

    let output = clean(evaled);
    if (output.length > 1024) {
      const { body } = await post('https://www.hastebin.com/documents').send(output);
      embed.addField('Output', `https://www.hastebin.com/${body.key}.js`);
    } else {
      embed.addField('Output', '```js\n' + output + '```');
    }
    msg.channel.send(embed);
  } catch (e) {
    let error = clean(e);
    if (error.length > 1024) {
      const { body } = await post('https://www.hastebin.com/documents').send(error);
      embed.addField('Error', `https://www.hastebin.com/${body.key}.js`);
    } else {
      embed.addField('Error', '```js\n' + error + '```');
    }
    msg.channel.send(embed);
  }
}

function clean(text) {
  if (typeof(text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
    return text;
}

exports.conf = {
  aliases: ["ev", "e"],
  cooldowns: '1',
  owner: true
}

exports.help = {
  name: "eval",
  description: "evaluated",
  usage: "eval {javascript code}"
}