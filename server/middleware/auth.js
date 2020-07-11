/**
 * 用户鉴权
 */
const config = require('config');
const UserService = require('../service/user');

module.exports = async function (ctx, next) {
    if (ctx.headers.token === config.get('login.token')) {
        await next();
    } else {
        const res = await UserService.check(ctx.headers.token, ctx.headers.username);
        if (res) {
            await next();
        } else {
            ctx.body = {
                code: 0,
                msg: '用户未登录',
            };
        }
    }
};
