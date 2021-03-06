/**
 * 配置的增删改查接口层
 * 1. 修改数据库中存储的数据
 * 2. 调用update服务，通知对方更新等
 */
const Router = require('koa-router');
const ConfigsModel = require('../model/configs');
const AuthMiddle = require('../middleware/auth');
const UpdateService = require('../service/update');
const SnapshotModel = require('../model/snapshot');
const LogsService = require('../service/logs');

const router = new Router();

//获取列表
router.get('/', async function (ctx) {
    const { limit, channel, key, nickname, state, status } = ctx.query;
    const opts = {};
    if (channel) {
        opts.channel = channel;
    }
    if (key) {
        opts.key = key;
    }
    if (nickname) {
        opts.nickname = nickname;
    }
    if (state !== '' && !isNaN(state * 1)) {
        opts.state = state * 1;
    }
    const data = await ConfigsModel.getCount(limit, opts, status);

    ctx.body = {
        code: 1,
        data,
    };
});
//添加、更新
router.post('/add', AuthMiddle, async function (ctx, next) {
    const data = ctx.request.body;
    const nickname = decodeURIComponent(ctx.headers.nickname);
    let proption = data.proption * 1;
    if (isNaN(proption)) proption = 0;
    const model = {
        channel: data.channel,
        channel_title: data.channel_title,
        title: data.title,
        key: data.key,
        key_type: data.key_type || 'text',
        val: data.val,
        proption,
        json_data: data.json_data,
        task_start_time: data.task_start_time,
        task_end_time: data.task_end_time,
        state: data.state,
        remark: data.remark,
        nickname: nickname,
    };
    if (data.id && data.id !== '0') {
        // model.status = 2;
        await ConfigsModel.update(model, data.id * 1);
        const result_data = UpdateService.transform(model);
        LogsService.changeConfigs(
            model.title,
            model.channel,
            model.key,
            result_data.result_data,
            model.proption,
            model.task_start_time,
            model.task_end_time,
            model.remark,
            0,
            nickname
        );
    } else {
        await ConfigsModel.insert(model);
    }

    ctx.body = {
        code: 1,
        data: {},
    };
});
//发布
router.post('/publish/:id', AuthMiddle, async function (ctx, next) {
    const id = ctx.params.id;

    try {
        const model = await ConfigsModel.get(id);

        const nickname = decodeURIComponent(ctx.headers.nickname);

        await ConfigsModel.use(id, nickname);

        const data = UpdateService.transform(model);
        await SnapshotModel.insert(data);

        UpdateService.updateByData(data);

        LogsService.startConfigs(model.title, model.channel, model.key, data.result_data, model.proption, model.task_start_time, model.task_end_time, nickname);

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
//暂停
router.post('/pause/:id', AuthMiddle, async function (ctx) {
    const id = ctx.params.id;
    const nickname = decodeURIComponent(ctx.headers.nickname);

    try {
        await ConfigsModel.unUse(id, nickname);
        const data = await SnapshotModel.del(id);

        UpdateService.removeByKey(data.key, data.channel);

        const model = await ConfigsModel.get(id);
        LogsService.pauseConfigs(model.title, data.channel, data.key, data.result_data, data.proption, data.task_start_time, data.task_end_time, nickname);

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
//频道下的内容
router.get('/preview/:id', async function (ctx) {
    const id = ctx.params.id;
    try {
        const model = await ConfigsModel.get(id);
        ctx.body = UpdateService.transform(model);
    } catch (error) {
        console.log(error);
        ctx.body = {
            msg: error.message,
        };
    }
});
//删除
router.post('/del/:id', AuthMiddle, async function (ctx) {
    const id = ctx.params.id;
    try {
        await ConfigsModel.del(id);
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

//获取单个
router.get('/:id', async function (ctx) {
    const id = ctx.params.id;
    try {
        const data = await ConfigsModel.get(id);
        ctx.body = {
            code: 1,
            data,
        };
    } catch (error) {
        console.log(error);
        ctx.body = {
            code: 0,
            msg: error.message,
        };
    }
});
module.exports = router;
