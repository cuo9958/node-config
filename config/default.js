//默认配置
module.exports = {
    db: {
        master: {
            host: '127.0.0.1',
            user: 'fe_pub',
            password: 'YXMerZesnykifbmB',
            database: 'fe_pub',
            connectionLimit: 2
        }
    },
    //开发环境，普通redis配置
    redis: 'redis://127.0.0.1:6379',
    //redis集群配置
    redisCluster: [],
    //ladp账户的组
    auth: {
        group: 'app_bundle'
    },
    //后门账户
    login: {
        username: 'admin',
        pwd: 'admin',
        token: 'adw278vwfer7iere7ui'
    },
    //测试环境和开发环境上传图片接口
    upload_server: 'http://upload.test.com/upload/img',
    //默认前缀，暂时无用
    pre_upload: 'config_api_',
    //生成环境域名
    upload_host: [
        'img1',
        'img2',
        'img3',
        'img4',
        'img5',
        'img6',
        'img7',
        'img8',
        'img9'
    ],
    //静态资源引用的默认路由
    public_url: ''
};
