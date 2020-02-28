const UserModel = require('../model/user');
const Redis = require('../db/redis');
const config = require('config');

module.exports = {
    async get(username) {
        if (username === undefined) return null;
        const cache_key = `fe_config_${username}`;
        const cache = await Redis.get(cache_key);
        if (!cache) {
            const data = await UserModel.find(username);
            if (data) {
                const model = {
                    id: data.id,
                    username: data.username,
                    qlist: data.qlist,
                    nickname: data.nickname,
                    status: data.status,
                    updatedAt: data.updatedAt
                };
                Redis.set(cache_key, JSON.stringify(model));
                return model;
            }
            return null;
        }
        return JSON.parse(cache);
    },
    async update(id) {
        const data = await UserModel.get(id);
        const cache_key = `fe_config_${data.username}`;
        const model = {
            id: data.id,
            username: data.username,
            qlist: data.qlist,
            nickname: data.nickname,
            status: data.status,
            updatedAt: data.updatedAt
        };
        Redis.set(cache_key, JSON.stringify(model));
    },
    //"添加配置","发布暂停配置","频道","用户管理","历史记录管理"
    qlist: {
        ADD_CONFIG: 0,
        PUB_CONFIG: 1,
        CHANNEL: 2,
        USER: 3,
        RECORD: 4
    },
    async check(username, key) {
        if (username === config.get('login.username')) return true;
        if (username === undefined) throw new Error('请登录');
        const model = await this.get(username);
        if (!model) throw new Error('操作用户不存在');
        const qlist = model.qlist.split(',');
        if (qlist.includes(key + '')) return true;
        throw new Error('你没有操作权限');
    }
};
