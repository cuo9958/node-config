/**
 * 更新配置内容
 * 配置存储位置：
 * 1. 数据库
 * 2. 本地内存,其他机器镜像
 * 3. 增加启动更新数据
 * 4. 更新本地和其他机器
 */
const SnapshotModel = require('../model/snapshot');
const MQService = require('./mq');
const JSON5 = require('json5');
const ResourceCache = require('../cache/resource');
const ConfigsModel = require('../model/configs');

//是否发起MQ通知：开发环境关闭
const IS_MQ_OPEN = process.env.NODE_ENV !== 'development';

MQService.onMsg('cpm_publish', function (channel) {
    console.log('收到', channel);

    updateByChannle(channel);
});
/**
 * 通知频道更新
 * @param {*} channel 频道
 */
function updateCacheFromMaster(channel) {
    if (!IS_MQ_OPEN) return;
    MQService.publish('cpm_publish', channel);
}

/**
 * 将configs的数据转成快照
 * @param {*} model configs的数据
 */
function transform(model) {
    const data = {
        id: model.id,
        channel: model.channel,
        key: model.key,
        proption: model.proption,
        result_data: '',
        task_start_time: model.task_start_time,
        task_end_time: model.task_end_time,
    };

    if (model.key_type === 'text') {
        data.result_data = model.val;
    }
    if (model.key_type === 'image') {
        data.result_data = model.val;
    }
    if (model.key_type === 'number') {
        result_data.val = model.val * 1;
        if (isNaN(result_data.val)) {
            data.result_data = 0;
        }
    }
    if (model.key_type === 'bool') {
        data.result_data = model.val === 'true' ? true : false;
    }
    if (model.key_type === 'json') {
        data.result_data = JSON5.parse(model.json_data);
    }

    if (data.result_data) {
        data.result_data = JSON5.stringify(data.result_data);
    }
    return data;
}
/**
 * 更新频道数据
 * @param {*} channel 频道
 */
async function updateByChannle(channel) {
    try {
        const list = await SnapshotModel.search(channel);
        ResourceCache.setAll(list);
        updateCacheFromMaster(channel);
    } catch (error) {
        console.log(error);
    }
}
module.exports = {
    /**
     * 拉起所有到本地内存
     */
    async init() {
        try {
            const list = await SnapshotModel.getAll();
            ResourceCache.setAll(list);
        } catch (error) {
            console.log(error);
        }
    },
    transform,
    /**
     * 更新configs对应id的内容
     * @param {*} id id
     */
    async updateByID(id) {
        try {
            const data = await ConfigsModel.get(id);
            this.updateByData(transform(data));
        } catch (error) {
            console.log(error);
        }
    },
    /**
     * 更新单个数据
     * @param {*} data 对象数据
     */
    async updateByData(data) {
        try {
            const result = JSON5.parse(data.result_data);
            ResourceCache.set(data.key, result.val, data.channel);
            updateCacheFromMaster(data.channel);
        } catch (error) {
            console.log(error);
        }
    },
    updateByChannle,
    /**
     * 根据key和频道删除内容
     * @param {*} key key
     * @param {*} channel 频道
     */
    removeByKey(key, channel) {
        ResourceCache.delete(key, channel);
        updateCacheFromMaster(channel);
    },
    /**
     * 移除整个频道
     * @param {*} channel 频道
     */
    removeByChannel(channel) {
        ResourceCache.deleteAll(channel);
        updateCacheFromMaster(channel);
    },
    /**
     * 通过id移除内容
     * @param {*} id id
     */
    async removeByID(id) {
        try {
            const data = await SnapshotModel.get(id);
            this.removeByKey(data.key, data.channel);
        } catch (error) {
            console.log(error);
        }
    },
};
