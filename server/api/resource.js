const Router = require("koa-router");
const SearchCache = require("../cache/search");

const router = new Router();

router.get("/", async function(ctx, next) {
    const data = await SearchCache.search();

    ctx.body = {
        status: 0,
        data
    };
});

router.get("/:channel", async function(ctx, next) {
    const { channel } = ctx.params;

    const data = await SearchCache.search(channel);

    ctx.body = {
        status: 0,
        data
    };
});

exports.routers = router.routes();
