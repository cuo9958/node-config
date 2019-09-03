const LRU = require("lru-cache");
const ConfigsModel = require("../../data/configs");
const JSON5 = require("json5");

//住缓存，缓存1分钟
const cache = new LRU({
    maxAge: 60000,
    updateAgeOnGet: true
});
//备份数据，缓存1天
const cache_bak = new LRU({
    maxAge: 86400000,
    updateAgeOnGet: true
});
//缓存乐观锁
const cache_lock = {};

async function searchFromData(channel) {
    const data = [];
    try {
        const list = await ConfigsModel.search(channel);
        list.forEach(item => {
            const result = JSON5.parse(item.result_data);
            data.push({
                result,
                state: item.state,
                task_start_time: item.task_start_time,
                task_end_time: item.task_end_time
            });
        });
    } catch (error) {
        console.log(error);
    }
    return data;
}

async function getList(channel) {
    if (cache.has(channel)) {
        return cache.get(channel);
    }
    if (cache_lock[channel] && cache_bak.has(channel)) {
        return cache_bak.get(channel) || {};
    }
    cache_lock[channel] = true;
    const data = await searchFromData(channel);
    cache.set(channel, data);
    cache_lock[channel] = false;
    return data;
}

module.exports = {
    async update(channel) {
        console.log("更新一次", channel);
        const data = await searchFromData(channel);
        cache.set(channel, data);
        return data;
    },
    async search(channel = "") {
        const list = await getList(channel);
        const now = Date.now();
        const result = {};
        list.forEach(item => {
            if (item.state === 0) {
                result[item.result.key] = item.result.val;
            } else {
                if (item.task_start_time === 0 && item.task_end_time === 0) {
                    result[item.result.key] = item.result.val;
                }
                if (item.task_start_time > 0 && item.task_end_time > 0) {
                    if (
                        now > item.task_start_time &&
                        now < item.task_end_time
                    ) {
                        result[item.result.key] = item.result.val;
                    }
                }
                if (item.task_start_time > 0 || item.task_end_time > 0) {
                    if (
                        item.task_end_time === 0 &&
                        now > item.task_start_time
                    ) {
                        result[item.result.key] = item.result.val;
                    }
                    if (
                        item.task_start_time === 0 &&
                        now < item.task_end_time
                    ) {
                        result[item.result.key] = item.result.val;
                    }
                }
            }
        });
        return result;
    }
};
