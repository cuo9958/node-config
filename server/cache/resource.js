/**
 * 常驻内存的配置内容
 * 1. 会过期的频道key
 * 2. 不会过期的频道内容
 */
const JSON5 = require('json5');

//内存频道内容，map比object添加速度快1倍，查询速度大多数情况快一点
const Channel_Data = new Map();

module.exports = {
    /**
     * 设置频道内的值
     * @param {*} key key
     * @param {*} value value
     * @param {*} channel 频道
     */
    set(key, value, channel) {
        const data = Channel_Data.get(channel) || {};
        data[key] = value;
        Channel_Data.set(channel, data);
    },
    /**
     * 批量设置数据，来源是快照数据块
     * @param {*} list 列表
     */
    setAll(list) {
        let data_tmp = {};
        list.forEach((model) => {
            try {
                const data = JSON5.parse(model.result_data);
                if (!data_tmp[model.channel]) data_tmp[model.channel] = {};
                data_tmp[model.channel][data.key] = data.val;
            } catch (error) {
                console.log('setAll', error);
            }
        });
        for (const channel in data_tmp) {
            if (data_tmp.hasOwnProperty(channel)) {
                const data = data_tmp[channel];
                Channel_Data.set(channel, data);
            }
        }
    },
    /**
     * 获取频道对应数据
     * @param {*} channel 频道
     */
    get(channel) {
        return Channel_Data.get(channel) || {};
    },
};
