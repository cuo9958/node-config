import React from 'react';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import './index.less';
import Divider from '@material-ui/core/Divider';

export default function (props: any) {
    return (
        <div id="container">
            <header id="header">头部</header>
            <div id="menus">
                菜单
                <div className="active">选择</div>
                <Divider light={true} />
            </div>
            <div id="content">
                <div className="header"></div>
                <div className="content-main">{props.children}</div>
            </div>
        </div>
    );
}
