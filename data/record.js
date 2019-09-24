const Sequelize = require("sequelize");
const db = require("../db/mysql");
const Op = Sequelize.Op;

const Record = db.define(
    "fe_config_record",
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        cid: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            comment: "原配置id"
        },
        channel: {
            type: Sequelize.STRING(20),
            defaultValue: 900,
            comment: "频道key"
        },
        channel_title: {
            type: Sequelize.STRING(20),
            defaultValue: 900,
            comment: "频道标题"
        },
        title: {
            type: Sequelize.STRING,
            defaultValue: "",
            comment: "标题"
        },
        key: {
            type: Sequelize.STRING,
            defaultValue: "",
            comment: "key名称"
        },
        key_type: {
            type: Sequelize.STRING(10),
            defaultValue: "",
            comment: "key类型"
        },
        val: {
            type: Sequelize.STRING,
            defaultValue: "",
            comment: "val值"
        },
        json_data: {
            type: Sequelize.TEXT,
            comment: "json对象的值"
        },
        task_start_time: {
            type: Sequelize.BIGINT,
            defaultValue: 0,
            comment: "开始日期"
        },
        task_end_time: {
            type: Sequelize.BIGINT,
            defaultValue: 0,
            comment: "结束日期"
        },
        state: {
            type: Sequelize.TINYINT,
            defaultValue: 0,
            comment: "类型"
        },
        remark: {
            type: Sequelize.STRING,
            defaultValue: "",
            comment: "备注"
        },
        nickname: {
            type: Sequelize.STRING(50),
            defaultValue: "",
            comment: "操作人"
        },
        status: {
            type: Sequelize.TINYINT,
            defaultValue: 0,
            comment: "状态;9:删除，0:编辑;1:发布"
        }
    },
    {
        freezeTableName: true
    }
);

//强制初始化数据库
// Record.sync({ force: true });

module.exports = {
    insert: function(model) {
        return Record.create(model);
    },
    get: function(id) {
        return Record.findOne({
            where: {
                id
            }
        });
    },
    getCount(cid, limit = 1, opts = {}) {
        let config = {
            limit: 20,
            offset: (limit - 1) * 20,
            attributes: [
                "id",
                "channel_title",
                "title",
                "key",
                "val",
                "key_type",
                "json_data",
                "state",
                "nickname",
                "status",
                "updatedAt"
            ],
            order: [["id", "desc"]]
        };
        config.where = Object.assign(
            {
                cid
            },
            opts
        );
        return Record.findAndCountAll(config);
    }
};
