const Router = require('koa-router');

const router = new Router();

//测试api
router.use('/api_config/test', require('./test').routes());

//正式接口，内部系统使用
router.use('/api_config/configs', require('./configs').routes());
router.use('/api_config/channel', require('./channel').routes());
router.use('/api_config/user', require('./user').routes());

//对外提供热配接口，无鉴权
router.use('/api_config/resource', require('./resource').routes());

module.exports = router;
