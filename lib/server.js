/**
 * 服务中心，提供对外访问的接口
 * 1.初始化配置
 * 2.读取本地配置
 * 3.开启定时存入配置，根据状态决定是否执行
 * 4.开启接口并渲染网站
 * 5.开启socket，监听连入的客户端
 * 6.接口有更新，改变状态并发送通知
 * 7.？加入签名等验证条件
 */
const Koa = require("koa");
const config = require("config");
const server = require("koa-static");
const KoaBody = require("koa-body");
const render = require("koa-art-template");
const api = require("./api");
const data = require("./data");

const app = new Koa();
const root_path = process.cwd();
const port = config.get("port") || 3000;

data.init();
/**
 * 设置模版引擎
 */
render(app, {
    root: root_path + "/views",
    extname: ".html",
    debug: config.get("debug")
});
/**
 * 静态资源
 */
app.use(server(root_path + "/public"));
/**
 * 处理返回对象
 */
app.use(KoaBody(config.get("body")));

app.use(api.routes()).use(api.allowedMethods());

/**
 * 错误处理页
 */
app.use(async function (ctx) {
    await ctx.render("err");
});
/**
 * koa错误
 */
app.on('error', (err, ctx) => {
    console.warn('server error', err, ctx)
});
/**
 * 监听
 */
app.listen(port, function () {
    console.log(config.get("name") + "已启动:" + port);
});
/**
 * 快捷键停止
 */
process.on('SIGINT', function () {
    process.exit();
});
/**
 * 其他退出
 */
process.on('exit', (code) => {
    console.log("app已停止:" + code)
});
/**
 * 其他错误
 */
process.on('uncaughtException', (code) => {
    console.log("app已停止:" + code)
});