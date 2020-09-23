const Router = require('koa-router');

const router = new Router();

router.get('/', async function (ctx, next) {
    ctx.body = 'ok';
});

module.exports = router;
