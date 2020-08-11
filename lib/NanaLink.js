module.exports = async (client, msg) => {
  if (!msg.channel.nsfw) return;
  
  let BookID = msg.content.match(/[\d]+/g)[0];
  await client.embeds.getInfoEmbed(BookID, msg);
};
