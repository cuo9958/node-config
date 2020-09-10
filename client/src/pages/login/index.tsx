import React from 'react';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import './index.less';

export default class extends React.Component {
    render() {
        return (
            <Container maxWidth="sm" id="login">
                <div className="box">
                    <div className="logo">Logo</div>
                    <div className="title">管理系统</div>
                    <div className="item">
                        <TextField variant="outlined" label="用户名" onChange={this.onInputChange} placeholder="请输入用户名" fullWidth />
                    </div>
                    <div className="item">
                        <TextField variant="outlined" label="密码" onChange={this.onInputChange} placeholder="请输入密码" fullWidth />
                    </div>
                </div>
            </Container>
        );
    }

    onInputChange = (e: any) => {
        console.log(e.target.value);
    };
}
