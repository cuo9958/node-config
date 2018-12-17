//测试工具
const TcpServer = require("../src/server");
const heart = require("../src/heart")

const server = new TcpServer({
    port: 8080,
});

heart.server(server);