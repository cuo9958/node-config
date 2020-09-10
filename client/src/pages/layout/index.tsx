import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import './index.less';
import Divider from '@material-ui/core/Divider';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import Container from '@material-ui/core/Container';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import RouteConfigs, { IRouteConfig } from '../../route/config';
import Utils from '../../service/Utils';
import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';

const theme = createMuiTheme({
    palette: {
        type: 'dark',
        divider: 'rgba(255, 255, 255, 0.12)',
    },
});

function Routes(Route: IRouteConfig, key: string, selected: boolean, go: any) {
    if (Route.hide) return null;
    return (
        <MenuItem className="menu-item" key={key} selected={selected} onClick={() => go(Route.path)}>
            <ListItemIcon className="menu-icon">{Route.Icon}</ListItemIcon>
            {Route.title}
        </MenuItem>
    );
}

export default function (props: any) {
    const history = useHistory();
    const location = useLocation();

    const go = (RoutePath: string) => {
        history.push(RoutePath);
    };
    const curr = Utils.checkUrl(location.pathname);

    return (
        <ThemeProvider theme={theme}>
            <div id="container">
                <header id="header">
                    头部
                    <div>
                        <Badge
                            color="primary"
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            variant="dot"
                            overlap="circle"
                            invisible={true}
                        >
                            <Avatar>N</Avatar>
                        </Badge>
                    </div>
                </header>
                <div id="menus">
                    <div className="left-box-btn">
                        <ArrowBackIosIcon fontSize="small" />
                    </div>
                    <Divider light={true} />
                    <MenuList autoFocusItem>{RouteConfigs.map((Route) => Routes(Route, Route.name, curr.name === Route.name, go))}</MenuList>
                </div>
                <div id="content">
                    <div className="header"></div>
                    <Container className="content-main">{props.children}</Container>
                </div>
            </div>
        </ThemeProvider>
    );
}
