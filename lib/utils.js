/**
 * 工具类
 */
module.exports = {
    /**
     * 获取连锁key下的值
     * @param {*} name 
     * @param {*} data 
     */
    getValue(name, data) {
        let res = data;
        name.split(".").forEach(key => res = res[key]);
        return res;
    }
}