/**
 * 心跳检测
 * 1.启动tcp服务
 * 2.监听来源
 * 3.使用密钥检测来源是否正确
 * 4.保存连接
 * 5.定时检测
 * 用到的命令
 * 接受的命令
 * leave：主动提供存活证明
 * check：检查是否值得连接
 */
const net = require("net");
const uuid = require("uuid");
const config = require("config");

let client_list = [];

/**
 * 创建客户端对象
 * @param {*} socket 
 */
function createClient(socket) {
    let client = {
        uid: uuid.v4(),
        socket,
        lastTime: Date.now()
    };
    client_list.push(client);
    return client;
}
const cmd = {
    /**
     * 检测客户端能否连接
     * @param {*} key 
     */
    check(token) {
        if (token != config.get("heart.token")) {
            this.socket.end();
        } else {
            this.socket.write("ready");
        }
    },
    /**
     * 更新时间
     */
    leave() {
        this.lastTime = Date.now();
    }
}
//创建tcp服务
const server = net.createServer(function (socket) {
    const client = createClient(socket);
    console.log(`已连接客户端：${client_list.length}`)
    socket.on('data', function (data) {
        const str = data.toString();
        const str_cmd = str.split("|");
        if (str_cmd.length < 1) return;
        let cmd_name = str_cmd.shift();
        cmd[cmd_name] && cmd[cmd_name].call(client, ...str_cmd);
    });
    socket.on('end', function () {
        client_list = client_list.filter(item => item.uid != client.uid);
    });
});

server.listen(config.get("heart.port"), function () {
    console.log("启动心跳检测服务", server.address());
});

module.exports = {
    /**
     * 给所有客户端发送消息
     */
    send(namespace, key = "", val) {
        client_list.forEach(socket => {
            socket.socket.write(`update|${namespace}|${key}`);
        })
    }
}