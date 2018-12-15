/**
 * 自定义命令语法
 */


module.exports = function (str) {
    const list = str.split("|");
    let name = list.unshift();
    return {
        name,
        data: list
    }
}