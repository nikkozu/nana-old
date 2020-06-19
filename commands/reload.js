exports.run = async (client, msg, args) => {
  msg.delete({ timeout: 5000 });
  if (!args || args.length < 1)
    return msg.reply("Must provide a command name to reload.");
  const commandName = args[0];
  // Check if the command exists and is valid
  if (!client.commands.has(commandName)) {
    return msg.reply("That command does not exist");
  }
  // the path is relative to the *current folder*, so just ./filename.js
  delete require.cache[require.resolve(`./${commandName}.js`)];
  // We also need to delete and reload the command from the client.commands Enmap
  client.commands.delete(commandName);
  const props = require(`./${commandName}.js`);
  client.commands.set(commandName, props);
  msg
    .reply(`The command ${commandName} has been reloaded`)
    .then(msg => msg.delete({ timeout: 5000 }));
};

exports.conf = {
  aliases: [],
  owner: true
};

exports.help = {
  name: "reload"
};
