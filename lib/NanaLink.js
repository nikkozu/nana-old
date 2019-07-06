const BASE_URL = 'https://nhentai.net/g/';

module.exports = async (client, msg) => {
    let BookID = msg.content.slice(BASE_URL.length).replace(/\//g, '');
    // console.log(BookID)
    await client.embeds.getInfoEmbed(BookID, msg);
}
