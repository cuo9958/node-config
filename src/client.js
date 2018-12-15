/**
 * 测试tcp客户端
 * 
 */
const net = require("net");
const cmd = require("./cmd");

const client = net.connect(8080, function () {
    console.log("client已连接")
});
client.on("data",function(d){
    console.log(d.toString())

    client.write("test|123456");
})
client.write("auther|123456");