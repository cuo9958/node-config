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

### 配置

1.打开当前ip加端口3000的网址：`127.0.0.1:3000`。这个端口是可以自己修改的。
2.添加或者修改配置。
3.已连接的客户端会自动更新最新的配置。

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
