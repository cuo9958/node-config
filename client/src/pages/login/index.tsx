import React from 'react';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import './index.less';
import AccountCircle from '@material-ui/icons/AccountCircle';
import InputAdornment from '@material-ui/core/InputAdornment';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Footer from '../../plugin/Footer';

export default class extends React.Component<IRoute> {
    render() {
        return (
            <Container maxWidth="sm" id="login">
                <div className="box">
                    <div className="logo">Logo</div>
                    <div className="title">管理系统</div>
                    <div className="item">
                        <TextField
                            variant="outlined"
                            label="用户名"
                            onChange={this.onInputChange}
                            placeholder="请输入用户名"
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AccountCircle></AccountCircle>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </div>
                    <div className="item">
                        <TextField
                            type="password"
                            variant="outlined"
                            label="密码"
                            onChange={this.onInputChange}
                            placeholder="请输入密码"
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <VpnKeyIcon></VpnKeyIcon>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </div>
                    <div className="item-small">
                        <label>
                            <Checkbox className="checkbox" color="primary" size="small" />
                            记住我?
                        </label>
                    </div>
                    <div className="item">
                        <Button variant="contained" color="primary" fullWidth onClick={this.login}>
                            登&nbsp;&nbsp;&nbsp;&nbsp;录
                        </Button>
                    </div>
                    <div className="item flex-right">
                        <Link
                            component="button"
                            variant="body2"
                            onClick={() => {
                                console.info("I'm a button.");
                            }}
                        >
                            忘记密码?
                        </Link>
                    </div>
                </div>
                <Footer />
            </Container>
        );
    }

    onInputChange = (e: any) => {
        console.log(e.target.value);
    };

    login = () => {
        this.props.history.push('/');
    };
}
