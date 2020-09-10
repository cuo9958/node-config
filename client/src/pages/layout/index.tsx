import React from 'react';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import './index.less';
import Divider from '@material-ui/core/Divider';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import Container from '@material-ui/core/Container';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import SendIcon from '@material-ui/icons/Send';

const theme = createMuiTheme({
    palette: {
        type: 'dark',
        divider: 'rgba(255, 255, 255, 0.12)',
    },
});

export default function (props: any) {
    return (
        <ThemeProvider theme={theme}>
            <div id="container">
                <header id="header">头部</header>
                <div id="menus">
                    <div className="left-box-btn">
                        <ArrowBackIosIcon fontSize="small" />
                    </div>
                    <Divider light={true} />
                    <MenuList autoFocusItem>
                        <MenuItem className="menu-item">
                            <ListItemIcon className="menu-icon">
                                <SendIcon fontSize="small" />
                            </ListItemIcon>
                            第一个
                        </MenuItem>
                        <MenuItem className="menu-item" selected>
                            <ListItemIcon className="menu-icon">
                                <AccountBalanceIcon fontSize="small" />
                            </ListItemIcon>
                            第二个
                        </MenuItem>
                    </MenuList>
                </div>
                <div id="content">
                    <div className="header"></div>
                    <Container className="content-main">{props.children}</Container>
                </div>
            </div>
        </ThemeProvider>
    );
}
