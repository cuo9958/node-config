const Client = require("../lib/client");

const client = new Client({}, function () {
    console.log("已连接")
});
//监听数据变化
client.on("data", function (key) {
    console.log("data", key)
})
client.on("end", function () {
    console.log("结束")
})
client.on("error", function () {
    console.log("错误")
})

async function test() {
    //获取配置对象
    let data = await client.config("开发环境", "a")
    console.log("test", data.message)
}

test();