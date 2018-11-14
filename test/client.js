const Client = require("../lib/client");

const client = new Client({}, function () {
    console.log("已连接")
});
//监听数据变化
client.on("data", function (key, data) {
    console.log(key, data)
})
client.on("end", function (key, data) {
    console.log("结束")
})
client.on("error", function (key, data) {
    console.log("错误")
})

async function test() {
    //获取配置对象
    let data = await client.config("def", "a")
    console.log(data)
}

test();