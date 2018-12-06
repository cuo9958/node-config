/**
 * 接口
 * 根据接口去开发对应的组件
 */


/**
 * 数据存储接口
 * 根据固定的接口实现对应的数据存储形式
 */
class iData {
    /**
     * 初始化数据存储类
     * mysql的连接池
     * 文件的默认路径
     * redis的连接对象
     */
    init() {}
    /**
     * 获取命名空间列表
     */
    list() {}
    /**
     * 获取全部配置
     * @param {*} namespace 
     */
    all(namespace = "def") {}
    /**
     * 更新一个新的命名空间,如果存在就报错
     * @param {*} namespace 
     * @param {*} txt 
     */
    update(namespace, txt) {}
    /**
     * 获取对应的值
     * @param {*} key 
     * @param {*} namespace 
     */
    get(key, namespace = "def") {}
    /**
     * 设置对应的值
     * @param {*} key 
     * @param {*} val 
     * @param {*} namespace 
     */
    set(key, val, namespace = "def") {}
    /**
     * 删除整个命名空间数据
     * @param {*} namespace 
     */
    del(namespace) {}
    /**
     * 判断用户登录
     * @param {*} user 
     * @param {*} pwd 
     */
    login(user, pwd) {}
}

module.exports = {
    iData
}