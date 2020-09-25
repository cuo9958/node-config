const Router = require('koa-router');
const SearchCache = require('../cache/search');
const fs = require('fs');
const path = require('path');


const router = new Router();
const HealthcheckPath = path.resolve(__dirname, '../../healthcheck.html');

router.get('/', async function(ctx, next) {
    const data = await SearchCache.search();
    ctx.body = {
        status: 0,
        data
    };
});

router.get('/:channel', async function(ctx, next) {
    const { channel } = ctx.params;
    const { clientid = '', uid = '' } = ctx.header;

    const data = await SearchCache.search(channel, clientid || uid);

    ctx.body = {
        status: 0,
        data
    };
});

router.all('/check/healthcheck.html', function(ctx) {
    const isAt = fs.existsSync(HealthcheckPath);
    if (!isAt) {
        ctx.status = 404;
    }
    ctx.body = {
        status: 0
    };
});

module.exports = router;
