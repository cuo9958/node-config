const Sequelize = require('sequelize');
const db = require('../db/mysql');

const Logs = db.define(
    'fe_logs',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: Sequelize.STRING,
            defaultValue: '',
            comment: '标题',
        },
        txts: {
            type: Sequelize.TEXT,
            defaultValue: '',
            comment: '日志内容',
        },
        remark: {
            type: Sequelize.STRING,
            defaultValue: '',
            comment: '备注',
        },
        nickname: {
            type: Sequelize.STRING,
            defaultValue: '',
            comment: '发布人',
        },
    },
    {
        freezeTableName: true,
    }
);

//强制初始化数据库
// Logs.sync({ force: true });

module.exports = {
    insert: function (model) {
        return Logs.create(model);
    },
    get: function (id) {
        return Logs.findOne({
            where: {
                id,
            },
        });
    },
    getCount(limit = 1, opts = {}) {
        let config = {
            limit: 20,
            offset: (limit - 1) * 20,
            order: [['id', 'desc']],
        };
        return Logs.findAndCountAll(config);
    },
};
