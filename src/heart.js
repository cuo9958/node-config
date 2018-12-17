/**
 * 固定时间检测客户端
 * 如果超时就结束它
 */
const schedule = require('node-schedule');

/**
 * 定时更新客户端任务
 * 每30秒检查一次超时
 */
function initServer(server) {
    schedule.scheduleJob('*/30 * * * * *', function () {
        server.clients.forEach(item => {
            if (Date.now() - item.lastTime > 30000) server.end(item.uid)
        });
    });
}

/**
 * 定时更新客户端时间
 * 每30秒更新一次
 */
function initClient(client) {
    schedule.scheduleJob('*/30 * * * * *', () => client.leave());
}

module.exports = {
    server: initServer,
    client: initClient
}