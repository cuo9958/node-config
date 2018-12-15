/**
 * 自定义命令语法
 */


module.exports = {
    //将buff分解成命令对象
    create(str) {
        str = str.toString();
        const list = str.split("|");
        list = list.map(item => item.replace("丨", "|"))
        let name = list.shift();
        return {
            name,
            value: list[0],
            data: list
        }
    },
    //参数转内容
    push() {
        let list = Array.prototype.splice.call(arguments, 0);
        //转化|
        list = list.map(item => item.replace("|", "丨"));
        console.log(list)
        return list.join("|");
    }
}