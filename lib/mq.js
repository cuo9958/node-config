/**
 * 消息队列的实现
 * 1. 监听key对应的消息
 * 2. 消息加入循环
 * 3. 消息消费，通知结果
 * 4. 消息销毁
 * 5. 发送一次进去备份阶段
 * 6. 备份超时就删除
 */
const Heart = require("./heart");

//队列
const queue = [];
//备份
const queue_bak = [];

//监听记录表
const clients = {};
//触发一次
function emit() {
    let msg = queue[0];
    let str = JSON.stringify(msg.data);
    Heart.sendEx(`topic|${msg.topic}|${str}`, msg.clientId);
}
/**
 * 监听对应的topic
 * @param {*} topic 
 * @param {*} clientId 
 */
function on(topic, clientId) {
    let body = clients[topic];
    if (body === undefined) {
        body = new Set();
    }
    body.add(clientId);
    clients[topic] = body;
}
/**
 * 移除监听
 * @param {*} topic 
 * @param {*} fn 
 */
function off(topic, clientId) {
    let body = clients[topic];
    if (body === undefined) return;
    body.delete(clientId);
    clients[topic] = body;
}
/**
 * 添加消息
 * @param {*} topic 
 * @param {*} data 
 */
function push(topic, clientId, data) {
    queue.push({
        topic,
        data,
        clientId
    });
    emit();
}
module.exports = class {
    constructor(clientId) {
        this.clientId = clientId;
    }

    on(topic, fn) {
        on(topic, this.clientId);
    }

    push(topic, data) {
        push(topic, this.clientId, data);
    }
}