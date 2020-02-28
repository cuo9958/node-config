import React, { Fragment } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import Utils from '../../services/utils';
import { iRouter } from '../../../@types/react';
import url_configs from '../../routes/config';

import { Layout } from 'element-react';
import './index.less';

interface iProps extends iRouter {
    history: iRouter;
    location: any;
    nickname: string;
    isLogin(): boolean;
}
interface IState {
    active: string;
    layout: boolean;
}

function Menus(item: any, onSelect: any, active: string) {
    if (item.hide) return;
    return (
        <div key={item.name} className={'menu_item' + (active === item.name ? ' active' : '')} onClick={() => onSelect(item.path)}>
            {item.title}
        </div>
    );
}

@inject((models: any) => ({
    isLogin: models.user.isLogin,
    nickname: models.user.nickname
}))
@observer
export default class extends React.Component<iProps, IState> {
    constructor(props: any) {
        super(props);
        const curr = Utils.checkUrl(props.location.pathname);
        this.state = {
            active: curr.name,
            layout: !curr.hideLayout
        };
    }

    render() {
        if (!this.state.layout) return this.props.children;
        return (
            <Fragment>
                <div id="top_box">
                    <Link to="/">
                        <div className="logo">
                            <img src="https://img1.daling.com/zin/public/specialTopic/2020/01/13/15/09/16/AHGUXXR000004757459.png" alt="" />
                            <div className="tit">
                                FNCM<small>v2.0</small>
                            </div>
                        </div>
                    </Link>
                    <div className="menus">
                        {url_configs.map((item, index) => Menus(item, this.onSelect, this.state.active))}
                        {this.props.isLogin && (
                            <div onClick={this.quit} className="menu_item">
                                退出
                            </div>
                        )}
                        {!this.props.isLogin && (
                            <div onClick={this.quit} className="menu_item">
                                登录
                            </div>
                        )}
                    </div>
                </div>
                <Layout.Row justify="center" type="flex">
                    <Layout.Col span="20" lg="20" md="24" sm="24" xs="24">
                        {this.props.children}
                    </Layout.Col>
                </Layout.Row>
            </Fragment>
        );
    }

    componentWillReceiveProps(pp: any) {
        const curr = Utils.checkUrl(pp.location.pathname);
        // this.props.check();
        this.setState({
            active: curr.name,
            layout: !curr.hideLayout
        });
    }

    onSelect = (index: string) => {
        this.props.history.push(index);
    };
    quit = () => {
        this.props.history.push('/login');
    };
}
