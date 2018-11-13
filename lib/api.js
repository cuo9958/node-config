/**
 * 对外提供接口服务
 */
const Router = require("koa-router");
const config = require("config")

const router = new Router({
    prefix: config.get("prefix")
});

router.get('/', async (ctx, next) => {
    await ctx.render("index");
});

module.exports = router;