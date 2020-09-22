const Koa = require('koa');
const KoaBody = require('koa-body');
const router = require('./api');

const app = new Koa();

app.use(
    KoaBody({
        multipart: true,
        formidable: {
            maxFieldsSize: 5 * 1024 * 1024,
        },
    })
);

// app.use(async (ctx, next) => {
//     const now = Date.now();
//     await next();
//     if (ctx.body.data) {
//         ctx.body.time = Date.now() - now;
//     }
// });

app.use(router.routes()).use(router.allowedMethods());

app.on('error', (err, ctx) => console.error('server error', err));
const port = process.env.PORT || '8200';
app.listen(port, function () {
    console.log(`服务器运行在http://127.0.0.1:${port}`);
});
