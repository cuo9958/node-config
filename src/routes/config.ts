import Home from '../pages/home';
import Detail from '../pages/detail';
import Channel from '../pages/channel';
import Login from '../pages/login';
import Record from '../pages/record';
import Test from '../pages/test';

export default [
    {
        /**
         * 页面名,菜单命中
         */
        name: 'home',
        /**
         * 显示名称
         */
        title: '配置列表',
        /**
         * url路径
         */
        path: '/',
        /**
         * 页面组件
         */
        page: Home,
        /**
         * 是否强制匹配
         */
        exact: true,
        /**
         * 是否隐藏外层视图
         */
        hideLayout: false,
        /**
         * 是否不在菜单展示
         */
        hide: false
    },
    //配置详情
    { name: 'detail', title: '配置详情', path: '/detail', page: Detail, exact: true },
    //编辑配置
    { name: 'detail', title: '编辑配置', hide: true, path: '/edit/:id', page: Detail, exact: true },

    //频道列表
    { name: 'channel', title: '频道列表', path: '/channel', page: Channel, exact: true },
    //历史记录
    { name: 'home', title: '历史记录', path: '/record/:id', page: Record, exact: true, hide: true },
    //登录
    { name: 'login', title: '登录', path: '/login', page: Login, exact: true, hide: true, hideLayout: true },

    { name: 'test', path: '*', page: Test, exact: true, hide: true }
];
