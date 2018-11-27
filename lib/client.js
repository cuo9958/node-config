/**
 * 客户端调用，提供访问远程配置
 * 1.传入参数
 * 2.存入内存本地默认配置
 * 3.远程获取配置
 * 4.监听远程数据变化
 * 5.更新本地配置
 */
const net = require("net");
const axios = require("axios");
const json5 = require("json5");

const defaults = {
    //远程地址
    host: "127.0.0.1",
    //心跳服务端口
    port: 8000,
    //接口所在的端口
    server_port: 3000,
    //验证用到的令牌
    token: "",
    //心跳检测周期
    time: 10000,
}
/**
 * 使用到的命令：
 * leave：检测是否存活
 * check：激活身份
 * 接受到的命令：
 * update：有值更新
 */
module.exports = class {
    /**
     * 启动客户端
     * @param {*} conf 远程调用地址
     * @param {*} conf 本地默认配置
     */
    constructor(conf, callback) {
        this.conf = Object.assign({}, defaults, conf);
        this.data = {}
        this.client = null;
        this.events = {}; //事件：ready、data、end、error
        this.timer = null; //定时器

        this.connect(callback);
    }
    /**
     * 连接心跳服务
     * @param {*} callback 
     */
    connect(callback) {
        this.client = net.connect(this.conf.port, this.conf.host, callback);
        this.client.on("data", buf => this.onData(buf.toString()))
        this.client.on("end", () => this.events["end"] && this.events["end"].call(this));
        this.client.on("error", err => this.events["error"].call(this, err));
        this.client.on("connect", () => this.start());
        this.cmd("check", this.conf.token);
    }
    /**
     * 定时发送检测数据
     */
    start() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        this.timer = setInterval(() => {
            this.cmd("leave", "");
        }, this.conf.time);
    }

    /**
     * 转化协议为对应的字符串
     * @param {*} name 
     * @param {*} val 
     */
    cmd(name, val) {
        try {
            if (typeof val === "string") {
                this.client.write(`${name}|${val}`, function () {
                    console.log("结束1")
                })
            } else {
                this.client.write(`${name}|${JSON.stringify(val)}`)
            }
        } catch (error) {
            console.log(error)
        }

    }
    /**
     * 收到消息
     * @param {*} str 
     */
    onData(str) {
        console.log("收到消息", str)
        const str_cmd = str.split("|");
        if (str_cmd.length < 1) return;
        let cmd_name = str_cmd.shift();
        try {
            this.events[cmd_name] && this.events[cmd_name].call(this, str_cmd);
            if (cmd_name === "update") {
                this.update(...str_cmd)
            }
        } catch (error) {
            console.log(error)
        }

    }
    /**
     * 更新配置
     * @param {*} namespace 
     * @param {*} key 
     */
    async update(namespace, key) {
        try {
            let data = await axios.get(`http://${this.conf.host}:${this.conf.server_port}/all/${namespace}`);
            if (data.data.code === 1) {
                let json = data.data.data;
                if (json.indexOf("{") === 0) json = json5.parse(json);
                this.data[namespace] = json;
            }
        } catch (error) {
            console.log(error);
        }
    }
    /**
     * 监听函数
     * @param {*} name 
     * @param {*} fn 
     */
    on(name, fn) {
        this.events[name] = fn;
    }
    /**
     * 获取配置
     * @param {*} namespace 
     * @param {*} key 
     */
    async config(namespace, key) {
        if (this.data[namespace] === undefined) {
            try {
                let data = await axios.get(`http://${this.conf.host}:${this.conf.server_port}/all/${namespace}`);
                if (data.data.code === 1) {
                    let json = data.data.data;
                    if (json.indexOf("{") === 0) json = json5.parse(json);
                    this.data[namespace] = json;
                    return json[key];
                }
            } catch (error) {
                console.log(error);
            }
            return null;
        }
        return this.data[namespace][key];
    }
}