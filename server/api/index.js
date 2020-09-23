const Router = require('koa-router');

const router = new Router();

//测试api
router.use('/api_config/test', require('./test').routes);

module.exports = router;
