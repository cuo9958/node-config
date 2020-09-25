/**
 * 更新配置内容
 * 配置存储位置：
 * 1.数据
 * 2.本地内存
 */
const SnapshotModel = require('../model/snapshot');
const MQService = require('./mq');
const JSON5 = require('json5');

//是否发起MQ通知：开发环境关闭
const IS_MQ_OPEN = process.env.NODE_ENV !== 'development';

/**
 * 通知频道更新
 * @param {*} channel 频道
 */
function updateCatchClause(channel) {
    if (!IS_MQ_OPEN) return;
    MQService.publish('cpm_publish', channel);
}
/**
 * 将configs的数据转成快照
 * @param {*} model configs的数据
 */
function transform(model) {
    const result_data = {
        key: model.key,
        val: '',
    };
    if (model.key_type === 'text') {
        result_data.val = model.val;
    }
    if (model.key_type === 'image') {
        result_data.val = model.val;
    }
    if (model.key_type === 'number') {
        result_data.val = model.val * 1;
        if (isNaN(result_data.val)) {
            result_data.val = 0;
        }
    }
    if (model.key_type === 'bool') {
        result_data.val = model.val === 'true' ? true : false;
    }
    if (model.key_type === 'json') {
        result_data.val = JSON5.parse(model.json_data);
    }
    return result_data;
}

module.exports = {
    /**
     * 拉起所有到本地内存
     */
    async init() {
        try {
            const list = await SnapshotModel.getAll();
            //TODO
        } catch (error) {
            console.log(error);
        }
    },
    transform,
    /**
     * 更新对应id的内容
     * @param {*} id id
     */
    async updateByID(id) {
        try {
            const data = await SnapshotModel.get(id);
            //TODO
        } catch (error) {
            console.log(error);
        }
    },
    /**
     * 整体更新数据
     * @param {*} data 对象数据
     */
    async updateByData(data) {
        //TODO
    },
    async updateByChannle(channel) {
        try {
            const data = await SnapshotModel.search(channel);
            //TODO
        } catch (error) {
            console.log(error);
        }
    },
    /**
     * 根据key和频道删除内容
     * @param {*} key key
     * @param {*} channel 频道
     */
    removeByKey(key, channel) {},
    /**
     * 移除整个频道
     * @param {*} channel 频道
     */
    removeByChannel(channel) {},
    /**
     * 通过id移除内容
     * @param {*} id id
     */
    removeByID(id) {},
};
