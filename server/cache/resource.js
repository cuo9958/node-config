/**
 * 常驻内存的配置内容
 * 1. 会过期的频道key
 * 2. 不会过期的频道内容
 */
const JSON5 = require('json5');
const Utils = require('../service/utils');

//内存频道内容，map比object添加速度快1倍，查询速度大多数情况快一点
//key:val
const Channel_Data = new Map();
//key:proption
const Channel_Data_Timer_Task = new Map();
//key:time1、time2
const Channel_Data_Grey = new Map();

function getFromGrey(channel, clientid) {
    if (!clientid) return null;
    const list = Channel_Data_Grey.get(channel) || [];
    const result = {};

    list.forEach((data) => {
        if (Utils.checkActive(clientid, data.proption)) {
            result[data.key] = data.val;
        }
    });
    return result;
}
function getFromTimer(channel) {
    const now = Date.now();
    const list = Channel_Data_Timer_Task.get(channel) || [];
    const result = {};

    list.forEach((data) => {
        //未开始
        if (data.task_start_time > 0 && data.task_start_time > now) return;
        //已结束
        if (data.task_end_time > 0 && data.task_end_time < now) return;
        result[data.key] = data.val;
    });
    return result;
}
function getFromCache(channel) {
    return Channel_Data.get(channel);
}

//设置普通配置的值
function setCache(channel, key, val) {
    const data = Channel_Data.get(channel) || {};
    data[key] = val;
    Channel_Data.set(channel, data);
}
function setTimer(channel, key, val, task_start_time, task_end_time) {
    const list = Channel_Data_Timer_Task.get(channel) || [];
    list.push({
        key,
        val,
        task_start_time,
        task_end_time,
    });
    Channel_Data_Timer_Task.set(channel, list);
}
function setGrey(channel, key, val, proption) {
    const list = Channel_Data_Grey.get(channel) || [];
    list.push({
        key,
        val,
        proption,
    });
    Channel_Data_Grey.set(channel, list);
}

module.exports = {
    /**
     * 设置频道内的值
     * @param {*} key key
     * @param {*} val val
     * @param {*} channel 频道
     */
    set(key, val, channel, state, proption, task_start_time, task_end_time) {
        if (state === 0) {
            setCache(channel, key, val);
        }
        if (state === 1) {
            setTimer(channel, key, val, task_start_time, task_end_time);
        }
        if (state === 2) {
            setGrey(channel, key, val, proption);
        }
    },
    /**
     * 批量设置数据，来源是快照数据块
     * @param {*} list 列表
     */
    setAll(list) {
        list.forEach((model) => {
            if (model.result_data) {
                const data = JSON5.parse(model.result_data);
                this.set(model.key, data.val, model.channel, model.state, model.proption, model.task_start_time, model.task_end_time);
            }
        });
    },
    /**
     * 获取频道对应数据
     * @param {*} channel 频道
     */
    get(channel, clientid) {
        //获取灰度
        const greyData = getFromGrey(channel, clientid);
        //获取定时
        const timeData = getFromTimer(channel);
        //获取普通的内容
        const data = getFromCache(channel);
        return { ...data, ...timeData, ...greyData };
    },
    /**
     * 删除单个
     * @param {*} key key
     * @param {*} channel 频道
     */
    delete(key, channel) {
        const data = Channel_Data.get(channel) || {};
        delete data[key];
        Channel_Data.set(channel, data);
    },
    /**
     * 删除整个频道
     * @param {*} channel 频道
     */
    deleteAll(channel) {
        Channel_Data.delete(channel);
    },
};
