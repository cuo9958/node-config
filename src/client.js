/**
 * 使用客户端
 */
const TcpClient = require("./TcpClient");
const heart = require("./heart");

let client = null;

module.exports = function (opt = {}) {
    if (client) return client;
    client = new TcpClient(opt);
    heart.client(client);
    return client;
}