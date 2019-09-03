/**
 * 更新缓存
 */
const cache_search = require("./search");
const RedisPub = require("../../db/redis_pub");

const redis = new RedisPub();
redis.subscribe("cpm_publish", function() {
    console.log("监听redis的cpm_publish频道");
});
redis.on("message", function(channel, message) {
    if (channel === "cpm_publish") {
        console.log("redis通知", message);
        cache_search.update(message);
    }
});
