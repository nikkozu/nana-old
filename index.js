const { ShardingManager } = require("discord.js");
const manager = new ShardingManager("./app.js", { token: process.env.TOKEN });

manager.spawn(2);
manager.on("shardCreate", shard => console.log(`Launched shard ${shard.id}`));

require("./server");
