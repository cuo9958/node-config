/**
 * 用户鉴权
 */
const config = require('config');

module.exports = async function(ctx, next) {
    if (ctx.headers.token === config.get('login.token')) {
        await next();
    } else {
        ctx.body = {
            code: 0,
            msg: '用户未登录'
        };
    }
};
