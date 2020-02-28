const Sequelize = require("sequelize");
const db = require("../db/mysql");

const Channel = db.define(
    "fe_config_channel",
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: Sequelize.STRING,
            defaultValue: "",
            comment: "标题"
        },
        key: {
            type: Sequelize.STRING(20),
            defaultValue: "",
            comment: "key值"
        },
        remark: {
            type: Sequelize.STRING,
            defaultValue: "",
            comment: "备注"
        },
        nickname: {
            type: Sequelize.STRING,
            defaultValue: "",
            comment: "发布人"
        },
        status: {
            type: Sequelize.TINYINT,
            defaultValue: 0,
            comment: "状态;0:失效;1:使用"
        }
    },
    {
        freezeTableName: true
    }
);

//强制初始化数据库
// Channel.sync({ force: true });

module.exports = {
    insert: function(model) {
        return Channel.create(model);
    },
    update: function(model) {
        return Channel.update(model, {
            where: {
                id: model.id
            }
        });
    },
    get: function(id) {
        return Channel.findOne({
            where: {
                id
            }
        });
    },
    getAll() {
        return Channel.findAll({
            where: {
                status: 1
            },
            attributes: ["id", "title", "key"]
        });
    },
    getCount(limit = 1, opts = {}) {
        let config = {
            limit: 20,
            offset: (limit - 1) * 20,
            order: [["status", "desc"], ["id", "desc"]]
        };
        return Channel.findAndCountAll(config);
    },
    change: function(status, id) {
        const model = {
            status
        };
        return Channel.update(model, {
            where: {
                id
            }
        });
    }
};
