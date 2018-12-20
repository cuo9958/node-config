const TcpClient = require("../src/TcpClient");
const heart = require("../src/heart")

const client = new TcpClient();

client._mq = function (data) {
    console.log(data)
}
heart.client(client);

client._mq_single = function (ag) {
    console.log("收到回馈", ag)
}
setTimeout(function () {
    client.send_mq({
        type: "single",
        data: "第一次发送消息"
    });
}, 3000)