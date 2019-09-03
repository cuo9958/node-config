const Sequelize = require("sequelize");
const db = require("../db/mysql");
const Op = Sequelize.Op;

const Configs = db.define(
    "fe_config_configs",
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
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
        result_data: {
            type: Sequelize.TEXT,
            comment: "发布之后的组合值"
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
            comment: "状态;9:删除，0:编辑;1:发布;2:有更新"
        }
    },
    {
        freezeTableName: true
        // indexes: [
        //     {
        //         unique: true,
        //         fields: ["code"]
        //     }
        // ]
    }
);

//强制初始化数据库
// Configs.sync({ force: true });

module.exports = {
    insert: function(model) {
        return Configs.create(model);
    },
    update: function(model, id) {
        return Configs.update(model, {
            where: { id }
        });
    },
    get: function(id) {
        return Configs.findOne({
            where: {
                id
            }
        });
    },
    search(channel) {
        return Configs.findAll({
            attributes: [
                "result_data",
                "task_start_time",
                "task_end_time",
                "state"
            ],
            where: {
                channel,
                [Op.or]: [{ status: 1 }, { status: 2 }]
            }
        });
    },
    getCount(limit = 1, opts = {}, status) {
        let config = {
            limit: 20,
            offset: (limit - 1) * 20,
            attributes: [
                "id",
                "channel",
                "channel_title",
                "title",
                "key",
                "key_type",
                "val",
                "json_data",
                "task_start_time",
                "task_end_time",
                "state",
                "nickname",
                "status",
                "updatedAt"
            ],
            order: [["id", "desc"]]
        };
        config.where = opts;
        if (status && !isNaN(status * 1)) {
            if (status * 1 === 0) {
                config.where.status = 0;
            }
            if (status * 1 === 1) {
                config.where.status = {
                    [Op.in]: [1, 2]
                };
            }
        } else {
            config.where.status = {
                [Op.not]: 9
            };
        }
        return Configs.findAndCountAll(config);
    },
    unUse: function(id) {
        const model = {
            status: 0
        };
        return Configs.update(model, {
            where: {
                id
            }
        });
    },
    use: function(id, result_data) {
        const model = {
            status: 1,
            result_data
        };
        return Configs.update(model, {
            where: {
                id
            }
        });
    },
    del: function(id) {
        const model = {
            status: 9
        };
        return Configs.update(model, {
            where: {
                id
            }
        });
    }
};
