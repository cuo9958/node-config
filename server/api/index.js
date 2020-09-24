const Router = require('koa-router');

const router = new Router();

//测试api
router.use('/api_config/test', require('./test').routes());
router.use('/api_config/configs', require('./configs').routes());
router.use('/api_config/channel', require('./channel').routes());
router.use('/api_config/user', require('./user').routes());
router.use('/api_config/resource', require('./resource').routes());

module.exports = router;
