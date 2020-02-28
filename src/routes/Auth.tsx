import React, { Fragment } from "react";
import { inject } from "mobx-react";
import { Route, Redirect } from "react-router-dom";

import Router_config from "./config";

interface iProps {
    location: any;
    isLogin(): boolean;
}

const notLogin = ["/login"];

function getRouterList() {
    const list: Array<any> = [];
    Router_config.forEach((item: any, index) => {
        list.push(
            <Route
                key={index}
                exact={!!item.exact}
                path={item.path}
                component={item.component}
            />
        );
    });
    return list;
}

@inject((models: any) => ({
    isLogin: models.user.isLogin
}))
class Auth extends React.Component<any, iProps> {
    render() {
        const { location } = this.props;
        const { pathname } = location;
        const isLogin = this.props.isLogin();

        if (!notLogin.includes(pathname) && !isLogin) {
            return <Redirect to="/login" />;
        }
        return <Fragment>{getRouterList()}</Fragment>;
    }
}
export default Auth;
