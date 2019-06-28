const { RichEmbed } = require("discord.js");

exports.run = async (client, msg, args, color) => {
    if (!args[0]) {
        const embed = new RichEmbed()
        .setColor(color)
        .setTitle('Nana helps')
        .setDescription(`Nana help you to directly read doujinshi on nHentai from your Discord channel, you can invite me with [This Link](https://discordapp.com/oauth2/authorize?client_id=583372268923518977&scope=bot&permissions=388160) or [Join my Server](https://discord.gg/sXzu4FY) (my Owner need suggestion for next update!)`)
        .addField('Command list', `- nhen random -- Get random doujinshi
    - nhen read \`<ID>\` -- Read doujinshi by the Id you provided
    - nhen lang \`<english/japanese/chinese>\` -- Get random doujinshi by the language you provided. You can use alias language too.\nExample: \`<ch/en/jp>\`.
    - nhen download \`<ID>\` -- Download doujinshi by the Id you provided`)
        .setFooter(`Nana V${client.version}`)
        .setTimestamp()
        msg.channel.send(embed);
    } else {
        let cmd = args[0];
        if (client.commands.has(cmd) || client.commands.get(client.aliases.get(cmd))) {
            let command = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
            if (command.conf.owner) return msg.channel.send(`Sorry **${msg.author.username}**, I can't find command \`${cmd}\`.`);
            let name = `${client.config.PREFIX} ${command.help.name}`;
            let desc = command.help.description;
            let aliases = command.conf.aliases;
            let usage = command.help.usage;
            let usages = Array.isArray(usage) ? usage : [usage];

            let embed = new RichEmbed()
            .setAuthor(client.user.username + ' Help Description', client.user.displayAvatarURL)
            .setTitle(aliases[0] ? `${name} ❱ ${client.config.PREFIX} ${aliases.join(` ❱ ${client.config.PREFIX} `)}` : name)
            .setDescription(desc)
            .setColor(color)
            .addField('Usage', usages[0] ? `${client.config.PREFIX} ${usages.join(`\n${client.config.PREFIX} `)}` : usages);
            return msg.channel.send(embed);
        }
        if (!client.commands.has(cmd) || !client.commands.get(client.aliases.get(cmd))) {
            msg.channel.send(`Sorry **${msg.author.username}**, I can't find command \`${cmd}\`.`);
        }
    }
    
}

exports.conf = {
  aliases: []
}

exports.help = {
    name: "help",
    description: "Display bot command list",
    usage: "help"
}
