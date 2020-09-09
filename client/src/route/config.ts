import test from '../pages/App';
import Error from '../pages/error';

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
        name: 'test',
        title: '测试内容',
        path: '/',
        layout: true,
        page: test,
    },
    {
        name: 'Error',
        title: '任务列表',
        path: '*',
        exact: false,
        page: Error,
    },
];
export default routes;
