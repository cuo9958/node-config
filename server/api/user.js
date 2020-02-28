const Router = require('koa-router');
const axios = require('axios');
const config = require('config');
const UserModel = require('../model/user');
const UserCache = require('../cache/user');

const router = new Router();

const encoded = data => {
    if (typeof data === 'string') return encodeURIComponent(data);
    if (typeof data === 'object') {
        let params = [];
        for (let k in data) {
            if (!data.hasOwnProperty(k)) return;
            params.push(`${encodeURIComponent(k)}=${encodeURIComponent(data[k] || '')}`);
        }
        return params.join('&');
    }
    return data;
};

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

    if (!username || !pwd) {
        return (ctx.body = {
            status: 1,
            msg: '登录账户或者密码为空'
        });
    }
    const model = await UserModel.find(username);
    if (!model || model.status !== 1) {
        return (ctx.body = {
            status: 1,
            msg: '账号不存在，请联系管理员'
        });
    }

    const res = await axios('http://aaa.corp.daling.com/api/checklogin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: encoded({
            username: username,
            password: pwd,
            project: config.get('auth.group'),
            expire: 86400
        })
    });
    if (res.status !== 200) {
        return (ctx.body = {
            status: 1,
            msg: '网络连接失败'
        });
    }
    const data = res.data;
    console.log(data);
    if (data.status == 0) {
        ctx.cookies.set('username', username, {
            expires: new Date(Date.now() + 86400000 * 2)
        });
        ctx.cookies.set('token', data.token, {
            expires: new Date(Date.now() + 86400000 * 2)
        });
        ctx.cookies.set('nickname', encodeURIComponent(data.displayname), {
            expires: new Date(Date.now() + 86400000 * 2)
        });

        ctx.body = {
            status: 0,
            data: {
                username: username,
                nickname: data.displayname,
                token: data.token,
                headimg: data.userphoto
            },
            db: data
        };
    } else {
        ctx.body = {
            status: 1,
            msg: data.message
        };
    }
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

    if (!username || !token) {
        return (ctx.body = {
            status: 1,
            msg: '登录账户或者密码为空'
        });
    }
    const res = await axios('http://aaa.corp.daling.com/api/checkauth', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: encoded({
            username: username,
            token: token,
            project: config.get('auth.group')
        })
    });
    if (res.status !== 200) {
        return (ctx.body = {
            status: 1,
            msg: '网络连接失败'
        });
    }
    const data = res.data;
    console.log(data);
    if (data.status == 0) {
        ctx.body = {
            status: 0,
            data: {
                nickname: data.displayname,
                headimg: data.userphoto
            }
        };
    } else {
        ctx.body = {
            status: 1,
            msg: data.message
        };
    }
});

router.get('/all', async function(ctx, next) {
    const { limit } = ctx.query;
    const data = await UserModel.getCount(limit);

    ctx.body = {
        status: 0,
        data
    };
});
router.post('/change/:id', async function(ctx, next) {
    try {
        const username = ctx.cookies.get('username');
        await UserCache.check(username, UserCache.qlist.USER);
    } catch (error) {
        return (ctx.body = {
            status: 1,
            msg: error.message
        });
    }

    const id = ctx.params.id;
    const { status } = ctx.request.body;
    const data = await UserModel.change(status, id);
    UserCache.update(id);
    ctx.body = {
        status: 0,
        data
    };
});
router.post('/add', async function(ctx, next) {
    try {
        const user_name = ctx.cookies.get('username');
        await UserCache.check(user_name, UserCache.qlist.USER);
    } catch (error) {
        return (ctx.body = {
            status: 1,
            msg: error.message
        });
    }
    const { id = '', username, qlist } = ctx.request.body;
    if (!username) {
        return (ctx.body = {
            status: 1,
            msg: '用户名不能为空'
        });
    }

    const nickname = decodeURIComponent(ctx.cookies.get('nickname'));
    const model = {
        username,
        qlist,
        nickname
    };
    if (!id || id === '0') {
        await UserModel.insert(model);
    } else {
        await UserModel.update(model, id);
        UserCache.update(id);
    }
    ctx.body = {
        status: 0,
        data: {}
    };
});
exports.routers = router.routes();
