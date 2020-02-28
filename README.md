# 全新的 nodejs 开发的轻量级配置中心

1. 全新改版，使用到的技术全部替换
2. 新的客户端和服务端通讯方式
3. 使用数据库保存内容
4. 使用 redis 保存内容

## 使用方式

1. 下载项目：[https://github.com/cuo9958/node-config/archive/master.zip](https://github.com/cuo9958/node-config/archive/master.zip)
2. 解压并安装依赖：`npm install`
3. 创建自己的配置文件并修改对应的配置
4. 启动项目,依赖pm2的可以修改pm2.json文件，依赖docker的可以修改docker文件

## 版本 v1.1

1. 添加灰度配置
2. 根据用户的 head 中的 clientid 和 uid 做灰度

想继续研究 socket 消息，rpg 方案的可以查看另外一个项目：https://github.com/cuo9958/node-socket

## 示例展示

![首页](https://github.com/cuo9958/node-config/raw/master/images/demo1.png)

## 第一版本 v1.0

1. 第一个版本没有使用客户端和服务器通讯的模式
2. 配置内容基于接口的情况获取，更适合 web、app 等模式获取配置

## 版本 v2.0.1

1. redis 订阅发布模式偶尔有抖动，切换成 mq 的广播模式

## 版本 2.0.2

1. 修改新的模式
2. 增加访客模式，用户名密码不再调用数据库，改用配置，后期增加用户鉴权的插件
3. 图片压缩库需要梯子才能下载，下载内容位于 github 上面。目前暂时关闭

``` json
    // "imagemin-gifsicle": "6.0.1",
    // "imagemin-jpegtran": "6.0.0",
    // "imagemin-optipng": "7.0.0",
```
