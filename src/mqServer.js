/**
 * 使用tcp做数据监听
 * 单点、多点、广播
 * 
 */
const tcpServer = require("./data").tcpServer;
const schedule = require('node-schedule');

//队列
const queue = [];
//备份
const queue_bak = [];

//每隔3秒执行一次
schedule.scheduleJob('*/3 * * * * *', function () {
    let ag = queue.shift();
    if (ag) {
        if (ag.type === "single") {
            tcpServer.sendRandom(this.uid, ag.name.replace("_", ""), ...ag.data);
        }
        if (ag.type === "broadcast") {
            tcpServer.sendEx(ag.uid, ag.name.replace("_", ""), ...ag.data);
        }
        if (ag.type === "all") {
            tcpServer.send(ag.name.replace("_", ""), ...ag.data);
        }
    }
});


//收到消息
tcpServer._mq_single = function (ag) {
    ag.uid = this.uid;
    queue.push(ag);
}
tcpServer._mq_broadcast = function (ag) {
    ag.uid = this.uid;
    queue.push(ag);
}
tcpServer._mq_all = function (ag) {
    // ag.uid = this.uid;
    queue.push(ag);
}


//对外提供部分api
module.exports = {

}