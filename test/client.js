const TcpClient = require("../src/TcpClient");
const heart = require("../src/heart")

const client = new TcpClient();

heart.client(client);