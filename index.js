const { ShardingManager } = require("discord.js");
const { TOKEN } = require("./config.json");
const manager = new ShardingManager("./app.js", { token: TOKEN });

manager.spawn();
manager.on("shardCreate", shard => console.log(`Launched shard ${shard.id}`));

// require("./server");
