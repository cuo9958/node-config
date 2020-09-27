import React from 'react';
import test from '../pages/test';
import Home from '../pages/confs';
import Channel from '../pages/channel';
import Error from '../pages/error';
import Login from '../pages/login';
import Detail from '../pages/detail';
import Logs from '../pages/logs';

import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import ViewListIcon from '@material-ui/icons/ViewList';
import AnnouncementIcon from '@material-ui/icons/Announcement';

export interface IRouteConfig {
    /**
     * 命名空间
     */
    name: string;
    /**
     * 显示的名称和标题
     */
    title: string;
    /**
     * 匹配的路径
     */
    path: string;
    /**
     * 图标
     */
    Icon?: any;
    /**
     * 匹配的内容
     */
    page: any;
    /**
     * 是否强制匹配,默认匹配
     */
    exact?: boolean;
    /**
     * 是否显示框架
     */
    layout?: boolean;
    /**
     * 是否显示在菜单
     */
    hide?: boolean;
}

const routes: IRouteConfig[] = [
    {
        name: 'home',
        title: '配置列表',
        path: '/',
        Icon: <AccountBalanceIcon fontSize="small" />,
        layout: true,
        page: Home,
    },
    {
        name: 'home',
        title: '配置详情',
        path: '/detail',
        layout: true,
        page: Detail,
        hide: true,
    },
    {
        name: 'channel',
        title: '频道列表',
        path: '/channel',
        Icon: <ViewListIcon fontSize="small" />,
        layout: true,
        page: Channel,
    },
    {
        name: 'logs',
        title: '日志列表',
        path: '/logs',
        Icon: <AnnouncementIcon fontSize="small" />,
        layout: true,
        page: Logs,
    },
    {
        name: 'test',
        title: '测试',
        path: '/test',
        page: test,
        hide: true,
    },
    {
        name: 'login',
        title: '登录',
        path: '/login',
        page: Login,
        hide: true,
    },
    {
        name: 'Error',
        title: '任务列表',
        path: '*',
        exact: false,
        layout: false,
        page: Error,
        hide: true,
    },
];
export default routes;
