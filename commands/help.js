const { MessageEmbed } = require("discord.js");

exports.run = async (client, msg, args, color) => {
  const app = await client.fetchApplication();

  if (!args[0]) {
    const embed = new MessageEmbed()
      .setColor(color)
      .setTitle("Nana helps")
      .setDescription(
        `Nana help you to directly read doujinshi on nHentai from your Discord channel, you can invite me with [This Link](https://nana.masami.xyz/invite) or [Join my Server](https://nana.masami.xyz/server) (my Owner need suggestion for next update!)`
      )
      .addField(
        "Command list",
        `- nh random -- Get random doujinshi
- nh read \`<ID>\` -- Read doujinshi by the Id you provided
- nh lang \`<english/japanese/chinese>\` -- Get random doujinshi by the language you provided. You can use alias language too.\nExample: \`<ch/en/jp>\`
- nh download \`<Book ID>\` -- Download doujin in zip file
- nh favorite \`[add/delete]\` \`<ID>\` (no args to see the list) -- Save your favorite doujin ID
- nh parody \`<Parody> [Language]\` -- Get random doujinshi by parody you provided
- nh tag \`<Tag> [Language]\` -- Get random doujinshi by tag you provided
- nh search \`<Query> [Language]\` -- Search nHentai site
- nh donate -- Showing donate page`
      )
      .setFooter(`Nana V${client.version} || <> = required, [] = optional`)
      .addField(
        "Changelogs",
        `- **BANNED** some tag, so you can read it again from me again`
      )
      .setTimestamp();
    msg.channel.send(embed);
  } else {
    let cmd = args[0];
    if (
      client.commands.has(cmd) ||
      client.commands.get(client.aliases.get(cmd))
    ) {
      let command =
        client.commands.get(cmd) ||
        client.commands.get(client.aliases.get(cmd));
      if (command.conf.owner)
        return msg.channel.send(
          `Sorry **${msg.author.username}**, I can't find command \`${cmd}\`.`
        );
      let name = `${client.config.PREFIX} ${command.help.name}`;
      let desc = command.help.description;
      let aliases = command.conf.aliases;
      let usage = command.help.usage;
      let usages = Array.isArray(usage) ? usage : [usage];

      let embed = new MessageEmbed()
        .setAuthor(
          client.user.username + " Help Description",
          client.user.displayAvatarURL
        )
        .setTitle(
          aliases[0]
            ? `${name} ❱ ${client.config.PREFIX} ${aliases.join(
                ` ❱ ${client.config.PREFIX} `
              )}`
            : name
        )
        .setDescription(desc)
        .setColor(color)
        .addField(
          "Usage",
          usages[0]
            ? `${client.config.PREFIX} ${usages.join(
                `\n${client.config.PREFIX} `
              )}`
            : usages
        );
      return msg.channel.send(embed);
    }
    if (
      !client.commands.has(cmd) ||
      !client.commands.get(client.aliases.get(cmd))
    ) {
      msg.channel.send(
        `Sorry **${msg.author.username}**, I can't find command \`${cmd}\`.`
      );
    }
  }
};

exports.conf = {
  aliases: []
};

exports.help = {
  name: "help",
  description: "Display bot command list",
  usage: "help"
};
