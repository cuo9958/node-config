const Koa = require('koa');
const Router = require('koa-router');
const KoaBody = require('koa-body');
require('./cache/update');
require('./schedule/clearEnd');

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

const test = require('./api/index');
const user = require('./api/user');
const channel = require('./api/channel');
const configs = require('./api/configs');
const record = require('./api/record');
const resource = require('./api/resource');
const imgs = require('./api/imgs');

router.use('/api_config/user', user.routers);
router.use('/api_config/channel', channel.routers);
router.use('/api_config/configs', configs.routers);
router.use('/api_config/record', record.routers);
router.use('/api_config/resource', resource.routers);
router.use('/api_config/imgs', imgs.routers);
router.use('/api_config/test', test.routers);

app.use(router.routes()).use(router.allowedMethods());

app.on('error', (err, ctx) => console.error('server error', err));
const port = process.env.PORT || '18062';
app.listen(port, function() {
    console.log(`服务器运行在http://127.0.0.1:${port}`);
});
