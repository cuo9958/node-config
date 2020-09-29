const Router = require('koa-router');
const LogsModel = require('../model/logs');

const router = new Router();

router.get('/', async function (ctx) {
    const { limit, nickname } = ctx.query;
    try {
        const data = await LogsModel.getCount(limit);
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
