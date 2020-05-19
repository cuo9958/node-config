const { authenticate } = require('ldap-authentication');
const config = require('config');

const cfg = config.get('ldap');

const options = {
    ldapOpts: {
        url: cfg.server,
    },
    adminDn: cfg.baseDn,
    adminPassword: cfg.bindPassword,
    userDn: cfg.bindPassword,
    userSearchBase: cfg.searchDn,
    usernameAttribute: cfg.usernameKey,
    userPassword: '',
    username: '',
};
/**
 * LDAP的登录方法
 * @param {*} username 用户名
 * @param {*} userPassword 密码
 */
async function login(username, userPassword) {
    const user = await authenticate(
        Object.assign({}, options, {
            username,
            userPassword,
        })
    );
    return {
        nickname: user.displayName,
        tell: user.telephoneNumber,
        username: user.uid,
    };
}

module.exports = { login };
