/**
 * 存储中心，提供本地存储
 * 1.本地文件存储，对外支持读和写
 * 2.支持多命名空间---多文件
 * 3.定时存储本地数据
 */
const fs = require("fs");

const data_path = process.cwd() + "/.data";

//内存数据
let global_data = {
    def: {}
}

/**
 * 加载对应的文件
 * @param {*} dir_path 
 */
function loadJson(dir_path) {
    let file_list = [];
    if (fs.existsSync(dir_path)) {
        file_list = fs.readdirSync(dir_path);
    }
    try {
        file_list.forEach(item => fn(item));
    } catch (error) {
        Logger.info(error.message);
    }
}
/**
 * 每10秒保存一次
 */
setInterval(function () {

}, 10000);

module.exports = {
    /**
     * 启动的时候初始化，读取所有本地存储文件
     */
    init() {
        //目录判断
        if (!fs.existsSync(data_path)) {
            fs.mkdirSync(data_path);
        }
        //默认文件判断
        if (!fs.existsSync(data_path + "/def.json")) {
            fs.writeFileSync(data_path + "/def.json", JSON.stringify(global_data.def));
        }
        loadJson(data_path,function(){});
    },
    /**
     * 获取全部配置
     * @param {*} namespace 命名空间
     */
    all(namespace = "def") {},
    /**
     * 获取对应的值
     * @param {*} name 
     * @param {*} namespace 
     */
    get(name, namespace = "def") {

    },
    /**
     * 设置对应的值
     * @param {*} name 
     * @param {*} data 
     * @param {*} namespace 
     */
    set(name, data, namespace = "def") {

    },
    /**
     * 添加一个新的命名空间,如果存在就报错
     * @param {*} namespace 
     */
    add(namespace) {}
}