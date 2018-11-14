/**
 * 客户端调用，提供访问远程配置
 * 1.传入参数
 * 2.存入内存本地默认配置
 * 3.远程获取配置
 * 4.监听远程数据变化
 * 5.更新本地配置
 */
const net = require("net");

const client = net.connect({
    port: 8000
}, function () {
    console.log("链接")
})

client.on("data", function (data) {
    console.log(data.toString())
})

client.on("end", function () {
    console.log("关闭")
})

client.write("check|12345")

module.exports = class {
    /**
     * 启动客户端
     * @param {*} conf 远程调用地址
     * @param {*} conf 本地默认配置
     */
    constructor(conf) {

    }
}