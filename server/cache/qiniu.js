const qiniu = require('qiniu');
const config = require('config');
const Redis = require('../../db/redis');

const qiniu_config = config.get('qiniu');
const qiniu_key = 'qiniu_token';

module.exports = {
    async update() {
        const old_token = await Redis.get(qiniu_key);
        if (old_token) return old_token;
        const mac = new qiniu.auth.digest.Mac(
            qiniu_config.accessKey,
            qiniu_config.secretKey
        );
        const options = {
            scope: qiniu_config.scope
        };
        const putPolicy = new qiniu.rs.PutPolicy(options);
        const token = putPolicy.uploadToken(mac);
        Redis.set(qiniu_key, token, 'EX', 3480);
        console.log('设置七牛的token', token);
        return token;
    },
    async uploadStream(filename, readableStream, prefix = '') {
        const Qconfig = new qiniu.conf.Config();
        Qconfig.zone = qiniu.zone.Zone_z0;
        const formUploader = new qiniu.form_up.FormUploader(Qconfig);
        const putExtra = new qiniu.form_up.PutExtra();
        const token = await Redis.get(qiniu_key);
        return new Promise((a, b) => {
            formUploader.putStream(
                token,
                prefix + filename,
                readableStream,
                putExtra,
                function(respErr, respBody, respInfo) {
                    if (respErr) {
                        return b(respErr);
                    }
                    if (respInfo.statusCode === 200) {
                        a({
                            filename: filename,
                            path: qiniu_config.path,
                            url: qiniu_config.path + '/' + prefix + filename
                        });
                    } else {
                        b();
                    }
                }
            );
        });
    },
    async uploadBuff(filename, buff, prefix = '') {
        const Qconfig = new qiniu.conf.Config();
        Qconfig.zone = qiniu.zone.Zone_z0;
        const formUploader = new qiniu.form_up.FormUploader(Qconfig);
        const putExtra = new qiniu.form_up.PutExtra();
        let token = await Redis.get(qiniu_key);
        if (!token) token = await this.update();
        return new Promise((a, b) => {
            formUploader.put(token, prefix + filename, buff, putExtra, function(
                respErr,
                respBody,
                respInfo
            ) {
                if (respErr) {
                    return b();
                }
                if (respInfo.statusCode === 200) {
                    a({
                        filename: filename,
                        path: qiniu_config.path,
                        url: qiniu_config.path + '/' + prefix + filename
                    });
                } else {
                    b();
                }
            });
        });
    }
};
