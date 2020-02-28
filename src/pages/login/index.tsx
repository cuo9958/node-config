import React from "react";
import { inject } from "mobx-react";
import { Button, Input, Notification } from "element-react";
import { iRouter } from "../../../@types/react";
import "./index.css";
import request from "../../services/request";

interface iProps {
    history: iRouter;
    login(data: any): void;
}
interface iState {
    username: string;
    pwd: string;
}
@inject((models: any) => ({
    login: models.user.login
}))
export default class extends React.Component<iProps, iState> {
    constructor(props: any) {
        super(props);
        this.state = {
            username: "",
            pwd: ""
        };
    }

    render() {
        return (
            <div id="login">
                <div className="box">
                    <div className="title">登&nbsp;&nbsp;&nbsp;录</div>
                    <div className="content">
                        <Input
                            placeholder="用户名"
                            onChange={(e: any) =>
                                this.setState({ username: e })
                            }
                        />
                        <Input
                            placeholder="密码"
                            type="password"
                            onChange={(e: any) => this.setState({ pwd: e })}
                        />
                        <Button
                            onClick={this.login}
                            className="login_btn"
                            type="info"
                        >
                            登录
                        </Button>
                        <div className="footer">解释权归前端团队所有</div>
                        <div className="footer">默认admin:admin</div>
                    </div>
                </div>
            </div>
        );
    }

    login = async () => {
        try {
            const data = await request.post("/user/login", {
                username: this.state.username,
                pwd: this.state.pwd
            });
            this.props.login(data);
            this.props.history.push("/");
        } catch (error) {
            console.log(error);
            Notification.error({
                message: error.message
            });
        }
    };
}
