const Router = require('koa-router');
const ConfigsModel = require('../model/configs');
// const RecordModel = require('../model/record');
const JSON5 = require('json5');
const AuthMiddle = require('../middleware/auth');
const MQService = require('../service/mq');

const router = new Router();

function updateCatchClause(channel) {
    MQService.publish('cpm_publish', channel);
}

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
        status: 0,
        data,
    };
});

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
        model.status = 2;
        await ConfigsModel.update(model, data.id * 1);
    } else {
        await ConfigsModel.insert(model);
    }

    ctx.body = {
        status: 0,
        data: {},
    };
});
//发布
router.post('/publish/:id', AuthMiddle, async function (ctx, next) {
    const id = ctx.params.id;

    const model = await ConfigsModel.get(id);

    const nickname = decodeURIComponent(ctx.headers.nickname);
    // const record = {
    //     cid: model.id,
    //     channel: model.channel,
    //     channel_title: model.channel_title,
    //     title: model.title,
    //     key: model.key,
    //     key_type: model.key_type,
    //     val: model.val,
    //     json_data: model.json_data,
    //     task_start_time: model.task_start_time,
    //     task_end_time: model.task_end_time,
    //     state: model.state,
    //     remark: model.remark,
    //     nickname,
    // };
    // await RecordModel.insert(record);

    const result_data = {
        key: model.key,
    };
    if (model.key_type === 'text') {
        result_data.val = model.val;
    }
    if (model.key_type === 'image') {
        result_data.val = model.val;
    }
    if (model.key_type === 'number') {
        result_data.val = model.val * 1;
        if (isNaN(result_data.val)) {
            result_data.val = 0;
        }
    }
    if (model.key_type === 'bool') {
        result_data.val = model.val === 'true' ? true : false;
    }
    if (model.key_type === 'json') {
        result_data.val = JSON5.parse(model.json_data);
    }
    await ConfigsModel.use(id, JSON.stringify(result_data));

    updateCatchClause(model.channel);

    ctx.body = {
        status: 0,
        data: {},
    };
});
router.post('/pause/:id', AuthMiddle, async function (ctx, next) {
    const id = ctx.params.id;
    await ConfigsModel.unUse(id);

    ConfigsModel.get(id).then((model) => {
        updateCatchClause(model.channel);
    });

    ctx.body = {
        status: 0,
        data: {},
    };
});

router.get('/:id', async function (ctx, next) {
    const id = ctx.params.id;
    const data = await ConfigsModel.get(id);
    ctx.body = {
        status: 0,
        data,
    };
});

module.exports = router;
