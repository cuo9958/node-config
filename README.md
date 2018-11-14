# node-config
nodejs的配置中心

启动配置中心并存储本地配置，客户端通过连接配置中心获得实时的配置更新。

## 说明

1. 启动server，即可启动配置中心以及一个简单的配置管理网站。
2. 启动client，自动根据参数链接配置中心。本地可以使用一份默认配置，也可以使用远程配置。

[示例地址](http://120.78.57.59:8200/)

## server

### 下载
将项目下载本地。可以从github上下载。[下载地址](https://github.com/cuo9958/node-config/archive/master.zip)

### 启动

`node lib/server.js`或者`npm run start`

也可以使用pm2来启动，项目根目录下提供了一份启动配置。使用`pm2 start pm2.json`可以启动。

### 使用配置管理界面

1. 打开当前ip加端口3000的网址：`127.0.0.1:3000`。这个端口是可以自己修改的。
2. 添加或者修改配置。
3. 已连接的客户端会自动更新最新的配置。

### 修改本地配置

本地配置在`config/default.js`文件中，也可以根据当前的`NODE_ENV`创建一个对应的配置文件：`developement.js`等。

修改配置让项目更合适你的需要。
```javascript
module.exports = {
    //项目名称
    name: "node-config",
    //中心端口
    port: 3000,
    //调试
    debug: true,
    //返回对象
    body: {},
    //api的前缀
    prefix: "",
    //心跳检测的配置
    heart: {
        //端口
        port: 8000,
        //令牌
        token: ""
    }
}
```

## client

执行`npm install --save tcp-node-config`引入客户端库。

### 启动

客户端需要实例化，传入服务端的地址和创建成功的可执行方法。
```javascript
const node_config = require("tcp-node-config");
const Client = node_config.Client;
const client = new Client({}, function () {
    console.log("已连接")
});
```

也可以使用自定义的配置启动客户端。
```javascript
const cfg={
        //远程地址
        host: "127.0.0.1",
        //心跳服务端口
        port: 8000,
        //接口所在的端口
        server_port: 3000,
        //验证用到的令
}
const client = new Client(cfg, function () {
    console.log("已连接")
});
```

### 使用

获取对应的配置，自动更新远程数据。如果不存在返回null。
```javascript
let data = await client.config("def", "a")
    console.log(data)
```

### 监听

可以监听数据变化或者服务停止等方法。
```javascript
//监听数据变化
client.on("data", function (namespace,key) {
    console.log(key)
})
client.on("end", function () {
    console.log("结束")
})
client.on("error", function (err) {
    console.log("错误")
})

```

## 可期待的特性

1. 多级配置自由获取
2. 使用sql、nosql数据库保存信息
3. 更完善的权限管理
4. 更好看的界面
