const Router = require('koa-router');

const router = new Router();

//测试api
router.use('/api_config/test', require('./test').routers);

module.exports = router;
