import React, { ChangeEvent } from 'react';
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
import { inject } from 'mobx-react';
import { IUser } from '../../models/user';

import { post } from '../../service/Request';

interface IState {
    [index: string]: string;
    username: string;
    pwd: string;
}
interface IProps extends IRoute {
    login(data: IUser): void;
}

@inject((models: any) => ({
    login: models.user.login,
}))
export default class extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            username: '',
            pwd: '',
        };
    }
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
                            onChange={(e) => this.onChange(e, 'username')}
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
                            onChange={(e) => this.onChange(e, 'pwd')}
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
    onChange = (elem: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, keyName: string) => {
        const data = {
            [keyName]: elem.target.value,
        };
        this.setState(data);
    };
    login = async () => {
        try {
            const data = await post('/user/login', {
                username: this.state.username,
                pwd: this.state.pwd,
                type: 'admin',
            });
            this.props.login(data);
            this.props.history.push('/');
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    };
}
