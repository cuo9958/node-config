const Router = require('koa-router');
const RecordModel = require('../model/record');
const ConfigsModel = require('../model/configs');
const AuthMiddle = require('../middleware/auth');

const router = new Router();

router.get('/', async function(ctx, next) {
    const { cid, limit } = ctx.query;
    const data = await RecordModel.getCount(cid * 1, limit);

    ctx.body = {
        status: 0,
        data
    };
});

router.post('/back/:id', AuthMiddle, async function(ctx, next) {
    const { id } = ctx.params;
    const record = await RecordModel.get(id);
    const nickname = decodeURIComponent(ctx.headers.nickname);
    const model = {
        channel: record.channel,
        channel_title: record.channel_title,
        title: record.title,
        key: record.key,
        key_type: record.key_type,
        val: record.val,
        json_data: record.json_data,
        task_start_time: record.task_start_time,
        task_end_time: record.task_end_time,
        state: record.state,
        remark: record.remark,
        nickname
    };
    await ConfigsModel.update(model, record.id);
    ctx.body = {
        status: 0,
        data: {}
    };
});

exports.routers = router.routes();
