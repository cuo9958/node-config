/**
 * 测试tcp服务
 * tcp管理客户端接入和消息传递
 * 模拟2次握手协议
 */
const net = require("net");
const uuid = require("uuid");
const cmd = require("./cmd");



const def = {
    port: 8080,
    timeout: 1000,
    token: "123456"
}

//创建对象
function createSocket(socket) {
    const client = {
        socket,
        uid: uuid.v4(),
        timer: null,
    }
    return client;
}

class TcpServer {
    constructor(opt) {
        //初始化默认数值
        //添加配置
        this.opt = Object.assign({}, def, opt);
        //服务对象
        this.server = null;
        //客户端对象池
        this.clients = new Map();

        //自启动
        this.run();
    }
    //启动服务
    run() {
        //创建服务
        const server = net.createServer(this.join.bind(this));
        //开启监听
        server.listen(this.opt.port);
        this.server = server;
    }
    //客户端加入
    join(socket) {
        //创建包装对象
        let client = createSocket(socket);
        //提前创建失败任务
        client.timer = setTimeout(() => {
            client.socket.end()
            client.socket.destroy()
            this.clients.delete(client.uid);
        }, this.opt.timeout);
        //加入池管理
        this.clients.set(client.uid, client);
        //添加数据监听
        socket.on("data", data => this.onData(data, client));
    }
    //收到消息
    onData(data, client) {
        const str = data.toString();
        if (str === "auther|" + this.opt.token) {
            clearTimeout(client.timer);
        }
    }

}

const server = new TcpServer({
    port: 8080,
});