const { RichEmbed } = require("discord.js");

exports.run = async (client, msg, args, color) => {
    const embed = new RichEmbed()
    .setColor(color)
    .setTitle('Nana helps')
    .setDescription(`Nana help you to directly read doujinshi on nHentai from your Discord channel, you can invite me with [This Link](https://discordapp.com/oauth2/authorize?client_id=583372268923518977&scope=bot&permissions=388160) or [Join Server](https://discord.gg/sXzu4FY)`)
    .addField('Command list', `- nhen random -- Get random doujinshi
- nhen read \`<ID>\` -- Read doujinshi by the Id you provided
- nhen lang \`<english/japanese/chinese>\` -- Get random doujinshi by the language you provided
- nhen download \`<ID>\` -- Download doujinshi by the Id you provided`)
    .setTimestamp()
    msg.channel.send(embed);
    
}

exports.conf = {
  aliases: []
}

exports.help = {
    name: "help",
    description: "Display bot command list",
    usage: "help"
}