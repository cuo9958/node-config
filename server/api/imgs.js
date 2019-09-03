const config = require("config");
const needle = require("needle");

const url = config.get("upload_server");

const pre_upload = config.get("pre_upload");

const Router = require("koa-router");
const fs = require("fs");
const gifsicle = require("imagemin-gifsicle");
const jpegtran = require("imagemin-jpegtran");
const optipng = require("imagemin-optipng");

const Jpeg = jpegtran();
const Png = optipng();
const Gif = gifsicle();

const router = new Router();

const hosts = config.get("upload_host");
function getHost() {
    const img = hosts[(Math.random() * hosts.length) >> 0];
    return `https://${img}.daling.com/zin/`;
}

router.post("/upload", async function(ctx, next) {
    const file = ctx.request.files.file;
    if (!file) {
        return (ctx.body = {
            status: 1,
            msg: "文件不存在"
        });
    }
    // const reader = fs.createReadStream(file.path);
    const reader = fs.readFileSync(file.path);
    console.log("临时文件", file.path);

    let file_buffer = null;

    let imgType = file.type.replace("image/", "");

    try {
        if (imgType === "jpg" || imgType === "jpeg") {
            file_buffer = await Jpeg(reader);
        }
        if (imgType === "png") {
            file_buffer = await Png(reader);
        }
        if (imgType === "gif") {
            file_buffer = await Gif(reader);
        }
        if (file_buffer === null) {
            return (ctx.body = {
                status: 1,
                msg: "图片格式不支持"
            });
        }
    } catch (error) {
        return (ctx.body = {
            status: 1,
            msg: "图片格式不支持",
            err: error.message
        });
    }

    console.log("上传图片", ctx.cookies.username, file.name, url);
    try {
        const resp = await needle(
            "post",
            url,
            {
                fileList: {
                    buffer: file_buffer,
                    filename: file.name,
                    content_type: file.type
                }
            },
            {
                multipart: true
            }
        );

        console.log("上传图片结果", ctx.cookies.username, file.name, resp.body);
        if (resp.body.status === 200) {
            ctx.body = {
                status: 0,
                data: getHost() + resp.body.data.fileList
                // data:"http://img.daling.com/st/dalingjia/app/lead3.png"
            };
        } else {
            ctx.body = {
                status: 1,
                msg: resp.body.error_msg,
                data: resp.body.data
            };
        }
    } catch (error) {
        ctx.body = {
            status: 1,
            msg: error.message
        };
    }
});

router.get("/test", function(ctx) {
    ctx.body = {
        status: 0,
        data: "测试"
    };
});
exports.routers = router.routes();
