const Router = require('koa-router');
const ChannelModel = require('../model/channel');
const AuthMiddle = require('../middleware/auth');
const LogsService = require('../service/logs');

const router = new Router();

router.get('/', async function (ctx, next) {
    const limit = ctx.query.limit;
    const data = await ChannelModel.getCount(limit);

    ctx.body = {
        code: 1,
        data,
    };
});

router.get('/all', async function (ctx, next) {
    const data = await ChannelModel.getAll();
    ctx.body = {
        code: 1,
        data,
    };
});

router.post('/', AuthMiddle, async function (ctx, next) {
    const { id = 0, title, key, remark = '' } = ctx.request.body;
    if (!title) {
        ctx.body = {
            code: 0,
            msg: '请填写标题',
        };
        return;
    }
    if (!key) {
        ctx.body = {
            code: 0,
            msg: '请填写key',
        };
        return;
    }
    try {
        const nickname = decodeURIComponent(ctx.headers.nickname);
        if (id > 0) {
            await ChannelModel.update({ id, title, key, remark, nickname });
            LogsService.changeChannel(id, title, key, remark, nickname);
        } else {
            await ChannelModel.insert({ title, key, remark, nickname });
            LogsService.addChannel(title, key, remark, nickname);
        }
        ctx.body = {
            code: 1,
            data: {},
        };
    } catch (error) {
        ctx.body = {
            code: 0,
            msg: error.message,
        };
    }
});

router.post('/change/:id', AuthMiddle, async function (ctx, next) {
    const { id } = ctx.params;
    const { status } = ctx.request.body;
    if (isNaN(status)) {
        ctx.body = {
            code: 0,
            msg: '状态有错',
        };
        return;
    }
    try {
        await ChannelModel.change(status, id);
        ctx.body = {
            code: 1,
            data: {},
        };
    } catch (error) {
        ctx.body = {
            code: 0,
            msg: error.message,
        };
    }
});

module.exports = router;
