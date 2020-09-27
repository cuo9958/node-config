const Router = require('koa-router');
const LogsModel = require('../model/logs');

const router = new Router();

router.get('/', async function (ctx) {
    const { limit, nickname } = ctx.query;
    try {
        const data = await LogsModel.getCount(limit);
        ctx.body = {
            status: 0,
            data,
        };
    } catch (error) {
        console.log(error);
        ctx.body = {
            status: 1,
            msg: error.message,
        };
    }
});

module.exports = router;
