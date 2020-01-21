#制定node镜像的版本
FROM node:10.15.3-alpine
#声明作者
MAINTAINER guofangchao
#移动当前目录下面的文件到app目录下
ADD . /app/
#进入到app目录下面，类似cd
WORKDIR /app
#安装依赖
RUN npm i
#对外暴露的端口
EXPOSE 8200
#设置环境变量
#ENV NODE_ENV development
ENV PORT 8200
ENV PARAMS=""
#程序启动脚本
CMD ["node", "server/index.js"]