/**
 * 测试tcp服务
 * tcp管理客户端接入和消息传递
 * 模拟2次握手协议:connect=>auther=>ok
 */
const net = require("net");
const uuid = require("uuid");
const cmd = require("./cmd");

const def = {
    run: true,
    port: 8080,
    timeout: 1000,
    token: "123456",
}

//创建对象
function createSocket(socket) {
    const client = {
        socket,
        uid: uuid.v4(),
        timer: null,
        lastTime: 0,
        send: function (...args) {
            socket.write(cmd.push(...args));
        }
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
        if (this.opt.run) this.run();
    }
    //启动服务
    run() {
        //创建服务
        const server = net.createServer(this.join.bind(this));
        //开启监听
        server.listen(this.opt.port);
        this.server = server;
        console.log("启动服务")
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
            console.log("未认证连接")
        }, this.opt.timeout);
        //加入池管理
        this.clients.set(client.uid, client);
        //添加数据监听
        socket.on("data", data => this.onData(data, client));
    }
    //收到消息
    onData(data, client) {
        //创建命令
        const ag = cmd.create(data);
        //更新时间
        client.lastTime = Date.now();
        //执行命令
        if (this[ag.name]) this[ag.name].call(this, ag, client);
    }
    //鉴权
    _auther(ag, client) {
        if (ag.value === this.opt.token) {
            clearTimeout(client.timer);
            client.send("ok", client.uid);
        } else {
            client.send("fail", "鉴权失败");
        }
    }
    /**
     * 给所有用户发消息
     * @param  {...any} list 
     */
    send(...list) {
        this.clients.forEach(client => client.send(...list))
    }
    /**
     * 给其他用户广播消息
     * @param  {...any} list 
     */
    sendEx(uid, ...list) {
        this.clients.forEach(client => {
            if (client.uid !== uid) client.send(...list);
        });
    }
    /**
     * 给一个用户发送消息
     * @param {*} uid 
     * @param  {...any} list 
     */
    sendTo(uid, ...list) {
        this.clients.forEach(client => {
            if (client.uid === uid) client.send(...list);
        });
    }
    /**
     * 排除自己之外随即发送一个
     * @param {*} uid 
     * @param  {...any} list 
     */
    sendRandom(uid, ...list) {
        let list = this.clients.keys();
        list = list.filter(item => item != uid);
        let key = list[Math.round(Math.random() * list.length)];
        let client = this.clients.get(key);
        if (!client) return;
        client.send(...list);
    }
    //结束客户端连接
    end(uid) {
        const client = this.clients.get(uid);
        if (!client) return;
        client.socket.end()
        client.socket.destroy()
        this.clients.delete(uid);
    }
}

module.exports = TcpServer;