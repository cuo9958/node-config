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
    //默认前缀，暂时无用
    pre_upload: 'config_api/',
    //七牛的配置
    qiniu: {
        //key
        accessKey: '',
        //key
        secretKey: '',
        //空间名称
        scope: '',
        //域名前缀
        path: ''
    }
};
