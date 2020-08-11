const { Collection } = require("discord.js");
const cooldowns = new Collection();

module.exports = async (client, msg) => {
  if (msg.author.bot || !msg.guild) return;

  let prefix = client.config.PREFIX;
  let color = client.config.COLOR;
  let args = msg.content
    .slice(prefix.length)
    .trim()
    .split(/ +/g);
  let command = args.shift().toLowerCase();
  let nick =
    msg.member.nickname !== null
      ? `${msg.member.nickname}`
      : msg.author.username;

  if (
    msg.content.toLowerCase() === `<@${client.user.id}>` ||
    msg.content.toLowerCase() === `<@!${client.user.id}>`
  ) {
    msg.channel.send(`My prefix: \`${prefix}\`\nExample: \`${prefix} random\``);
  }

  if (/(https:\/\/)?(nhentai)\.(net)\/g\/[\d]+\/?/g.test(msg))
    return require("../lib/NanaLink")(client, msg);
  if (!msg.content.toLowerCase().startsWith(prefix)) return undefined;

  let cmd =
    client.commands.get(command) ||
    client.commands.get(client.aliases.get(command));
  if (!cmd) return;
  if (cmd.conf.owner && !client.config.OWNERS.includes(msg.author.id)) return;
  if (!cooldowns.has(cmd.help.name))
    cooldowns.set(cmd.help.name, new Collection());

  let member = msg.member;
  let now = Date.now();
  let timeStamp = cooldowns.get(cmd.help.name) || new Collection();
  let cool = cmd.conf.cooldown || 5;
  let userCool = timeStamp.get(msg.author.id) || 0;
  let estimated = userCool + cool * 1000 - now;

  if (userCool && estimated > 0) {
    return msg.channel
      .send(
        `**${member.user.username}**, you have to wait **${(
          estimated / 1000
        ).toFixed()}s** before use the same command`
      )
      .then(msg => msg.delete({ timeout: estimated }));
  }

  timeStamp.set(msg.author.id, now);
  cooldowns.set(cmd.help.name, timeStamp);
  cmd.run(client, msg, args, color);
};
