const redis = require("redis");

const redisClient = redis.createClient();
redisClient.on("error", (err) => console.log("Redis Client Error", err));
redisClient.on("connect", () => console.log("Redis Client connecto OK"));
module.exports = redisClient;
//# sourceMappingURL=redis.js.map
