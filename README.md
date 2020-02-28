# 全新的nodejs开发的轻量级配置中心

1. 全新改版，使用到的技术全部替换
2. 新的客户端和服务端通讯方式
3. 使用数据库保存内容
4. 使用redis保存内容


想继续研究socket消息，rpg方案的可以查看另外一个项目：https://github.com/cuo9958/node-socket

## 版本v1.1

1. 添加灰度配置
2. 根据用户的head中的clientid和uid做灰度

## 第一版本v1.0

1. 第一个版本没有使用客户端和服务器通讯的模式
2. 配置内容基于接口的情况获取，更适合web、app等模式获取配置

## 版本v2.0.1

1. redis订阅发布模式偶尔有抖动，切换成mq的广播模式

## 版本2.0.2

1. 修改新的模式
