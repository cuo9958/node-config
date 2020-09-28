const Sequelize = require('sequelize');
const db = require('../db/mysql');

const Rule = db.define(
    'fe_config_rule',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        origin: {
            type: Sequelize.STRING,
            defaultValue: '',
            comment: '地址匹配规则',
        },
        method: {
            type: Sequelize.STRING(7),
            defaultValue: '',
            comment: '请求方法',
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
// Rule.sync({ force: true });

module.exports = {
    install() {
        return Rule.sync({ force: true });
    },
    insert: function (model) {
        return Rule.create(model);
    },
    find: function (id) {
        return Rule.findOne({
            where: {
                id,
            },
        });
    },
    update: function (model, id) {
        return Rule.update(model, {
            where: {
                id,
            },
        });
    },
    get: function (id) {
        return Rule.findOne({
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
        return Rule.findAndCountAll(config);
    },
    change: function (status, id) {
        const model = {
            status,
        };
        return Rule.update(model, {
            where: {
                id,
            },
        });
    },
};
