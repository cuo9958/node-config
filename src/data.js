/**
 * 存储中心，提供本地存储
 * 1.本地文件存储，对外支持读和写
 * 2.支持多命名空间---多文件
 * 3.定时存储本地数据
 */
const fs = require("fs");
const config = require("config");
const TcpServer = require("./TcpServer");
const utils = require("./utils");

const tcpServer = new TcpServer();
const data_path = process.cwd() + "/.data";

//有变化的数据
let changed = [];
//内存数据
let global_data = {
    def: ""
}

/**
 * 加载对应的文件
 * @param {*} dir_path 
 */
function loadJson(dir_path, fn) {
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
 * 异步保存文件
 * @param {*} name 
 * @param {*} data 
 */
function writeData(name, data) {
    if (!changed.includes(name)) return;
    changed = changed.filter(item => item != name);
    let txt = data;
    if (typeof (txt) !== "string") {
        txt = JSON.stringify(txt);
    }
    fs.writeFile(data_path + "/" + name + ".json", txt, function (err) {
        if (err) console.warn(err);
    });
}

function delFile(name) {
    delete global_data[name];
    fs.unlink(data_path + "/" + name + ".json", );
}
/**
 * 每10秒保存一次
 */
setInterval(function () {
    for (const name in global_data) {
        if (global_data.hasOwnProperty(name)) {
            const data = global_data[name];
            writeData(name, data);
        }
    }
}, 10000);

module.exports = {
    tcpServer,
    /**
     * 启动的时候初始化，读取所有本地存储文件
     */
    init() {
        //目录判断
        if (!fs.existsSync(data_path)) {
            fs.mkdirSync(data_path);
        }
        //加载所有数据
        loadJson(data_path, function (item) {
            let name = item.replace(".json", "");
            let data = fs.readFileSync(data_path + "/" + item, "utf-8")
            global_data[name] = data;
        });
    },
    /**
     * 获取命名空间列表
     */
    list() {
        let list = [];
        for (const name in global_data) {
            if (global_data.hasOwnProperty(name)) {
                list.push(name)
            }
        }
        return list;
    },
    /**
     * 获取全部配置
     * @param {*} namespace 命名空间
     */
    all(namespace = "def") {
        return global_data[namespace];
    },
    /**
     * 更新一个新的命名空间,如果存在就报错
     * @param {*} namespace 
     */
    update(namespace, txt) {
        changed.push(namespace);
        tcpServer.send(namespace, "", txt);
        global_data[namespace] = txt;
    },
    /**
     * 获取对应的值
     * @param {*} name 
     * @param {*} namespace 
     */
    get(key, namespace = "def") {
        let data = global_data[namespace];
        try {
            let json = JSON.parse(data);
            return utils.getValue(key, json);
        } catch (error) {
            console.log(error)
            return null;
        }
    },
    /**
     * 设置对应的值
     * @param {*} name 
     * @param {*} data 
     * @param {*} namespace 
     */
    set(key, val, namespace = "def") {
        changed.push(namespace);
        let data = global_data[namespace];
        tcpServer.send(namespace, key, val);
        try {
            let json = JSON.parse(data);
            json[key] = val;
            global_data[namespace] = JSON.stringify(json);
        } catch (error) {
            console.log(error)
        }
    },
    del(namespace) {
        if (!namespace) return;
        delFile(namespace)
    },
    /**
     * 判断用户登录
     * @param {*} user 
     * @param {*} pwd 
     */
    login(user, pwd) {
        if (user != config.get("user")) return false;
        if (pwd != config.get("pwd")) return false;
        return true;
    }
}