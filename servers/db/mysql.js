/**
 * 数据库连接类
 */
const Sequelize = require('sequelize');
const config = require('config');

const dbConfig = config.db.master;

const mysqlconnection = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
    host: dbConfig.host,
    port: dbConfig.port || 3306,
    dialect: 'mysql',
    dialectOptions: {
        charset: 'utf8'
    },
    pool: {
        max: dbConfig.connectionLimit,
        min: 0,
        idle: 10000
    }
});
module.exports = mysqlconnection;