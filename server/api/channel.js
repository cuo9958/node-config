const Router = require("koa-router");
const ChannelModel = require("../model/channel");
const UserCache = require("../cache/user");

const router = new Router();

router.get("/", async function(ctx, next) {
    const limit = ctx.query.limit;
    const data = await ChannelModel.getCount(limit);

    ctx.body = {
        status: 0,
        data
    };
});

router.get("/all", async function(ctx, next) {
    const data = await ChannelModel.getAll();
    ctx.body = {
        status: 0,
        data
    };
});

router.post("/", async function(ctx, next) {
    try {
        const username = ctx.cookies.get("username");
        await UserCache.check(username, UserCache.qlist.CHANNEL);
    } catch (error) {
        return (ctx.body = {
            status: 1,
            msg: error.message
        });
    }

    const { id = 0, title, key, remark = "" } = ctx.request.body;
    if (!ctx.cookies.get("token")) {
        ctx.body = {
            status: 1,
            msg: "请登录"
        };
        return;
    }
    if (!title) {
        ctx.body = {
            status: 1,
            msg: "请填写标题"
        };
        return;
    }
    if (!key) {
        ctx.body = {
            status: 1,
            msg: "请填写key"
        };
        return;
    }
    try {
        const nickname = decodeURIComponent(ctx.cookies.get("nickname"));
        if (id > 0) {
            await ChannelModel.update({ id, title, key, remark, nickname });
        } else {
            await ChannelModel.insert({ title, key, remark, nickname });
        }
        ctx.body = {
            status: 0,
            data: {}
        };
    } catch (error) {
        ctx.body = {
            status: 1,
            msg: error.message
        };
    }
});

router.post("/change/:id", async function(ctx, next) {
    try {
        const username = ctx.cookies.get("username");
        await UserCache.check(username, UserCache.qlist.CHANNEL);
    } catch (error) {
        return (ctx.body = {
            status: 1,
            msg: error.message
        });
    }
    const { id } = ctx.params;
    const { status } = ctx.request.body;
    if (!status) {
        ctx.body = {
            status: 1,
            msg: "状态有错"
        };
        return;
    }
    if (!ctx.cookies.get("token")) {
        ctx.body = {
            status: 1,
            msg: "请登录"
        };
        return;
    }
    try {
        await ChannelModel.change(status, id);
        ctx.body = {
            status: 0,
            data: {}
        };
    } catch (error) {
        ctx.body = {
            status: 1,
            msg: error.message
        };
    }
});

exports.routers = router.routes();
