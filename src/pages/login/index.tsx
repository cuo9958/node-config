import React from 'react';
import { inject } from 'mobx-react';
import { Button, Input, Notification, Radio } from 'element-react';
import { iRouter } from '../../ts/react';
import './index.css';
import request from '../../services/request';

interface iProps {
    history: iRouter;
    login(data: any): void;
}
interface iState {
    username: string;
    pwd: string;
    type: string;
}
@inject((models: any) => ({
    login: models.user.login,
}))
export default class extends React.Component<iProps, iState> {
    constructor(props: any) {
        super(props);
        this.state = {
            username: '',
            pwd: '',
            type: '',
        };
    }

    render() {
        return (
            <div id="login">
                <div className="box">
                    <div className="title">登&nbsp;&nbsp;&nbsp;录</div>
                    <div className="group">
                        <Radio.Group value={this.state.type} onChange={this.onChange.bind(this)}>
                            <Radio value="">LDAP登录</Radio>
                            <Radio value="admin">其他登录</Radio>
                        </Radio.Group>
                    </div>
                    <div className="content">
                        <Input placeholder="用户名" onChange={(e: any) => this.setState({ username: e })} />
                        <Input placeholder="密码" type="password" onChange={(e: any) => this.setState({ pwd: e })} />
                        <Button onClick={this.login} className="login_btn" type="info">
                            登录
                        </Button>
                        <div className="footer">解释权归前端团队所有</div>
                    </div>
                </div>
            </div>
        );
    }
    onChange(type: string) {
        this.setState({ type });
    }
    login = async () => {
        try {
            const data = await request.post('/user/login', {
                username: this.state.username,
                pwd: this.state.pwd,
                type: this.state.type,
            });
            this.props.login(data);
            this.props.history.push('/');
        } catch (error) {
            console.log(error);
            Notification.error({
                message: error.message,
            });
        }
    };
}
