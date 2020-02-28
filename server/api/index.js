const Router = require('koa-router');
const config = require('config');

const router = new Router();

router.post('/login', async function(ctx, next) {
    const username = ctx.request.body.username;
    const pwd = ctx.request.body.pwd;
    if (username === config.get('login.username') && pwd === config.get('login.pwd')) {
        ctx.cookies.set('username', username, {
            expires: new Date(Date.now() + 86400000 * 2)
        });
        ctx.cookies.set('token', config.get('login.token'), {
            expires: new Date(Date.now() + 86400000 * 2)
        });
        ctx.cookies.set('nickname', encodeURIComponent('超级管理员'), {
            expires: new Date(Date.now() + 86400000 * 2)
        });
        return (ctx.body = {
            status: 0,
            data: {
                username: username,
                nickname: '超级管理员',
                token: config.get('login.token'),
                headimg: ''
            }
        });
    }

    ctx.body = {
        status: 1,
        msg: '账号不存在，请联系管理员'
    };
});

router.post('/auth', async function(ctx, next) {
    const username = ctx.cookies.get('username');
    const token = ctx.cookies.get('token');

    if (username === config.get('login.username') && token === config.get('login.token')) {
        return (ctx.body = {
            status: 0,
            data: {
                nickname: '超级管理员',
                headimg: ''
            }
        });
    }

    ctx.body = {
        status: 1,
        msg: '登录账户或者密码为空'
    };
});

exports.routers = router.routes();
