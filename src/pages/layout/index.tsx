import React, { Fragment } from "react";
import { observer, inject } from "mobx-react";
import { Link } from "react-router-dom";
import { iRouter } from "../../ts/react";
import pathToRegexp from "path-to-regexp";

import { Menu, Layout } from "element-react";
import "./index.less";

import Router_config from "../../routes/config";

interface iProps {
    history: iRouter;
    location: any;
    nickname: string;
    isLogin(): boolean;
}

@inject((models: any) => ({
    isLogin: models.user.isLogin,
    nickname: models.user.nickname
}))
@observer
export default class extends React.Component<iProps> {
    render() {
        if (this.props.location.pathname === "/login") {
            return this.props.children;
        }
        const RouterPath = Router_config.find(item =>
            pathToRegexp(item.path).test(this.props.location.pathname)
        ) || { name: "" };
        return (
            <Fragment>
                <div id="top_box">
                    <Link to="/">
                        <div className="logo">配置中心<small>v2</small></div>
                    </Link>
                    <Menu
                        defaultActive={RouterPath.name}
                        className="top_menu"
                        mode="horizontal"
                        onSelect={this.onSelect}
                    >
                        <Menu.SubMenu index="me" title={this.props.nickname}>
                            <Menu.Item index="quit">退出</Menu.Item>
                        </Menu.SubMenu>
                        <Menu.Item index="user">用户管理</Menu.Item>
                        <Menu.Item index="channel">频道管理</Menu.Item>
                        <Menu.Item index="detail">添加配置</Menu.Item>
                        <Menu.Item index="home">发布列表</Menu.Item>
                    </Menu>
                </div>
                <Layout.Row justify="center" type="flex">
                    <Layout.Col span="20" lg="20" md="24" sm="24" xs="24">
                        {this.props.children}
                    </Layout.Col>
                </Layout.Row>
            </Fragment>
        );
    }

    onSelect = (key: string) => {
        if (key === "home") this.list();
        if (key === "detail") this.editor();
        if (key === "channel") this.goPage("/channel");
        if (key === "user") this.goPage("/user");
        if (key === "quit") this.quit();
    };

    goPage(pathname: string) {
        this.props.history.push(pathname);
    }
    /**
     * 查看列表
     */
    list() {
        this.props.history.push("/");
    }
    /**
     * 新增
     */
    editor() {
        this.props.history.push("/detail");
    }
    /**
     * 用户管理
     */
    manger() {
        console.log("go manger");
    }
    quit() {
        this.props.history.push("/login");
    }
}
