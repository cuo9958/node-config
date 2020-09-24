const uuid = require('uuid');
const Redis = require('../db/redis');
/**
 * 新增一个用户名密码,有效期30天
 * @param {*} username 用户名
 * @param {*}} pwd 密码
 */
function add(data) {
    const token = uuid.v4();
    Redis.set(`config_user_${token}`, JSON.stringify(data), 'EX', 2592000);
    return token;
}
/**
 * 检查token
 * @param {*} token token
 * @param {*} username username
 */
async function check(token, username) {
    try {
        const str = await Redis.get(`config_user_${token}`);
        const data = JSON.parse(str);
        return data.username === username;
    } catch (error) {
        return false;
    }
}
module.exports = { add, check };
