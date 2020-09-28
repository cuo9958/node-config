const Sequelize = require('sequelize');
const db = require('../db/mysql');
const Op = Sequelize.Op;
const MData = require('./configs').MData;

//快照，内存留存的备份
const Snapshot = db.define(
    'fe_configs_snapshot',
    {
        xid: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        id: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            comment: '来源id',
        },
        result_data: {
            type: Sequelize.TEXT,
            comment: '发布之后的组合值',
        },
        ...MData,
    },
    { freezeTableName: true, indexes: [{ unique: true, fields: ['id'] }] }
);

// Snapshot.sync({ force: true });

module.exports = {
    insert: function (model) {
        return Snapshot.create(model);
    },
    update: function (model, id) {
        return Snapshot.update(model, {
            where: { id },
        });
    },
    get: function (id) {
        return Snapshot.findOne({
            where: {
                id,
            },
        });
    },
    search(channel) {
        return Snapshot.findAll({
            where: {
                channel,
            },
        });
    },
    getAll() {
        return Snapshot.findAll();
    },
    async del(id) {
        try {
            const model = await Snapshot.findOne({
                where: { id },
            });
            if (!model) return null;
            await model.destroy();
            return model;
        } catch (error) {
            return null;
        }
    },
};
