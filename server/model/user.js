const Sequelize = require('sequelize');
const db = require('../db/mysql');

const User = db.define(
    'fe_config_user',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        username: {
            type: Sequelize.STRING,
            defaultValue: '',
            comment: '用户名',
        },
        qlist: {
            type: Sequelize.STRING,
            defaultValue: '',
            comment: '权限列表',
        },
        nickname: {
            type: Sequelize.STRING,
            defaultValue: '',
            comment: '发布人',
        },
        status: {
            type: Sequelize.TINYINT,
            defaultValue: 0,
            comment: '状态;0:失效;1:使用',
        },
    },
    {
        freezeTableName: true,
    }
);

//强制初始化数据库
// User.sync({ force: true });

module.exports = {
    install() {
        return User.sync({ force: true });
    },
    insert: function (model) {
        return User.create(model);
    },
    find: function (username) {
        return User.findOne({
            where: {
                username,
            },
        });
    },
    update: function (model, id) {
        return User.update(model, {
            where: {
                id,
            },
        });
    },
    get: function (id) {
        return User.findOne({
            where: {
                id,
            },
        });
    },
    getCount(limit = 1, opts = {}) {
        let config = {
            limit: 20,
            offset: (limit - 1) * 20,
            order: [
                ['status', 'desc'],
                ['id', 'desc'],
            ],
        };
        return User.findAndCountAll(config);
    },
    change: function (status, id) {
        const model = {
            status,
        };
        return User.update(model, {
            where: {
                id,
            },
        });
    },
};
