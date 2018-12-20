/**
 * 测试tcp客户端
 * 
 */
const net = require("net");
const cmd = require("./cmd");

function createClient(socket) {
    return {
        socket,
        uid: "",
        send: function (...args) {
            socket.write(cmd.push(...args));
        }
    }
}

const def = {
    port: 8080,
    timeout: 1000,
    token: "123456"
}

const mq_def = {
    type: "single", //single,broadcast,all
    data: "",
}

module.exports = class Client {
    constructor(opt) {
        //初始化默认数值
        //添加配置
        this.opt = Object.assign({}, def, opt);
        //客户端对象
        this.client = null;

        //连接
        this.connect();
    }
    //连接
    connect() {
        const socket = net.connect(this.opt.port);
        let client = createClient(socket);
        //发送鉴权
        socket.on("connect", this.auther.bind(this));
        //添加数据监听
        socket.on("data", this.onData.bind(this));
        //对象包装
        this.client = client;
    }
    //鉴权
    auther() {
        this.client.send("auther", this.opt.token);
    }
    //收到消息
    onData(data) {
        //创建命令
        const ag = cmd.create(data);
        console.log(ag)
        //执行命令
        if (this[ag.name]) this[ag.name].call(this, ag);
    }
    //连接正常
    _ok(ag) {
        this.client.uid = ag.value;
    }
    //重新活一次
    leave() {
        this.client.send("test")
    }
    //添加监听
    on(key, fn) {
        this.client.socket.on(key, fn);
    }
    /**
     * 发送命令
     * @param  {...any} list 
     */
    send(...list) {
        this.client.send(...list);
    }
    /**
     * 发送mq消息
     * @param {*} opt 
     */
    send_mq(opt) {
        let opts = Object.assign({}, mq_def, opt);
        this.client.send("mq_" + opts.type, opts.data);
    }
}