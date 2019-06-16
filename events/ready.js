const pkg = require("../package.json");

module.exports = client => {
    const version = pkg.version;
  
    client.setInterval(() => {
        let status = []; // Add you own rich presence here
        let rand = client.util.getRandInt(status.length);
      
        client.user.setActivity(status[rand], { type: "PLAYING" });
    }, 10000);
  
    console.log(`${client.user.username} is playing with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds...`);
    
}
