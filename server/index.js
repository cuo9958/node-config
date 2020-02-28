const Koa = require('koa');
const Router = require('koa-router');
const KoaBody = require('koa-body');
require('./cache/update');
require('./schedule');

const app = new Koa();
const router = new Router();

app.use(
    KoaBody({
        multipart: true,
        formidable: {
            maxFieldsSize: 5 * 1024 * 1024
        }
    })
);

app.use(async (ctx, next) => {
    const now = Date.now();
    await next();
    if (ctx.body.data) {
        ctx.body.time = Date.now() - now;
    }
});

const user = require('./api/index');
const channel = require('./api/channel');
const record = require('./api/record');
const resource = require('./api/resource');
const imgs = require('./api/imgs');
const configs = require('./api/configs');

router.use('/api_config/channel', channel.routers);
router.use('/api_config/record', record.routers);
router.use('/api_config/resource', resource.routers);
router.use('/api_config/imgs', imgs.routers);
router.use('/api_config/user', user.routers);
router.use('/api_config/configs', configs.routers);

app.use(router.routes()).use(router.allowedMethods());

app.on('error', (err, ctx) => console.error('server error', err));
const port = process.env.PORT || '8200';
app.listen(port, function() {
    console.log(`服务器运行在http://127.0.0.1:${port}`);
});
