/**
 * 记录日志
 * 1. 频道操作日志
 * 2. 配置内容发布日志
 */
const LogsModel = require('../model/logs');

async function add(title, txts, nickname, remark = '') {
    LogsModel.insert({ title, txts, nickname, remark });
}

module.exports = {
    /**
     * 添加频道
     * @param {*} title 标题
     * @param {*} key key
     * @param {*} remark 备注
     * @param {*} nickname 操作人
     */
    addChannel(title, key, remark, nickname) {
        add('添加频道:' + title, key, nickname, remark);
    },
    /**
     * 修改频道
     * @param {*} id id
     * @param {*} title 标题
     * @param {*} key key
     * @param {*} remark 备注
     * @param {*} nickname 操作人
     */
    changeChannel(id, title, key, remark, nickname) {
        add('修改频道:' + title, `id:${id};key:${key};`, nickname, remark);
    },
    /**
     * 更改配置状态或内容
     * @param {*} title 标题
     * @param {*} channel 频道
     * @param {*} key key
     * @param {*} str 最终结果
     * @param {*} proption 比例
     * @param {*} task_start_time 开始时间
     * @param {*} task_end_time 结束时间
     * @param {*} remark 备注
     * @param {*} status 状态
     * @param {*} nickname 操作人
     */
    changeConfigs(title, channel, key, str, proption, task_start_time, task_end_time, remark, status, nickname) {},
    /**
     *配置生效
     * @param {*} title 标题
     * @param {*} channel 频道
     * @param {*} key key
     * @param {*} data 结果
     * @param {*} proption 比例
     * @param {*} task_start_time 开始时间
     * @param {*} task_end_time 结束时间
     * @param {*} nickname 操作人
     */
    startConfigs(title, channel, key, data, proption, task_start_time, task_end_time, nickname) {
        add('配置生效:' + title, `频道:${channel};key:${key};内容:${data};比例:${proption};开始日期:${task_start_time};结束日期:${task_end_time}`, nickname);
    },
    /**
     * 配置失效
     * @param {*} title 标题
     * @param {*} channel 频道
     * @param {*} key key
     * @param {*} data 结果
     * @param {*} proption 比例
     * @param {*} task_start_time 开始时间
     * @param {*} task_end_time 结束时间
     * @param {*} nickname 操作人
     */
    pauseConfigs(title, channel, key, data, proption, task_start_time, task_end_time, nickname) {
        add('配置失效:' + title, `频道:${channel};key:${key};内容:${data};比例:${proption};开始日期:${task_start_time};结束日期:${task_end_time}`, nickname);
    },
};
