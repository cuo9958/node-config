const Sequelize = require('sequelize');
const db = require('../db/mysql');
const Op = Sequelize.Op;
const MData = require('./configs').MData;

//快照，内存留存的备份
const Snapshot = db.define('fe_configs_snapshot', { ...MData }, { freezeTableName: true, indexes: [{ unique: true, fields: ['key'] }] });

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
        return Configs.findAll({
            // attributes: ['result_data', 'task_start_time', 'task_end_time', 'state', 'proption'],
            where: {
                channel,
            },
        });
    },
};
