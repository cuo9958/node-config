/**
 * 对外提供接口服务
 */
const Router = require("koa-router");
const config = require("config");
const data = require("./data");

const router = new Router({
    prefix: config.get("prefix")
});

//管理平台页面
router.get('/', async (ctx, next) => {
    await ctx.render("index");
});
//获取所有配置列表
router.get('/list', async (ctx, next) => {
    ctx.body = {
        code: 1,
        data: data.list()
    }
});
//获取默认的配置内容
router.get('/all', async (ctx, next) => {
    ctx.body = {
        code: 1,
        data: data.all()
    }
});
//获取当前命名空间的所有内容
router.get('/all/:name', async (ctx, next) => {
    let name = ctx.params.name;
    const res = data.all(name);
    ctx.body = {
        code: 1,
        data: res
    }
});
//一次性设置所有内容
router.post('/all/:name', async (ctx, next) => {
    let name = ctx.params.name;
    let txt = ctx.request.body.txt;
    ctx.body = {
        code: 1,
        data: data.update(name, txt)
    }
});

//获取对应的key
router.get('/:namespace/:key', async (ctx, next) => {
    let namespace = ctx.params.namespace;
    let key = ctx.params.key;
    ctx.body = {
        code: 1,
        data: data.get(key, namespace)
    }
});
// //设置对应的key
// router.post('/:namespace/:key', async (ctx, next) => {
//     let namespace = ctx.params.namespace;
//     let key = ctx.params.key;
//     let val = ctx.request.body;
//     data.set(key, val, namespace)
//     ctx.body = {
//         code: 1,
//     }
// });
module.exports = router;