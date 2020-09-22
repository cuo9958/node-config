//默认配置
module.exports = {
    db: {
        master: {
            host: '127.0.0.1',
            user: 'fe_pub',
            password: 'YXMerZesnykifbmB',
            database: 'fe_pub',
            connectionLimit: 2,
        },
    },
    //开发环境，普通redis配置
    redis: 'redis://127.0.0.1:6379',
    //redis集群配置
    redisCluster: [],
    //后门账户
    login: {
        username: 'admin',
        pwd: 'admin',
        token: 'adw278vwfer7iere7ui',
    },
    //图片的路径前缀
    pre_upload: 'test/',
    //七牛的配置
    qiniu: {
        //key
        accessKey: '',
        //key
        secretKey: '',
        //空间名称
        scope: '',
        //域名前缀
        path: '',
    },
    //mq的配置,单机情况下可以将值设置为false
    amq: {
        hostname: '127.0.0.1',
        username: 'daling',
        password: 'daling',
        vhost: '/fe_dev',
    },
    //LDAP的登录方式
    ldap: {
        server: 'ldap://ldap.srv.daling.com',
        baseDn: 'cn=admin,dc=daling,dc=com',
        bindPassword: 'daling.com',
        searchDn: 'dc=daling,dc=com',
        usernameKey: 'uid',
    },
};
