/**
 * 默认配置
 */
module.exports = {
    //项目名称
    name: "node-config",
    //中心端口
    port: 3000,
    //调试
    debug: false,
    //返回对象
    body: {},
    //api的前缀
    prefix: "",
    //登录用到的用户名
    user: "admin",
    //登录用到的密码
    pwd: "admin",
    //心跳检测的配置
    heart: {
        //端口
        port: 8000,
        //令牌
        token: ""
    }
}