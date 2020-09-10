import React from 'react';
import Button from '@material-ui/core/Button';
import { inject } from 'mobx-react';

@inject((models: any) => ({
    nickname: models.user.nickname,
}))
export default class App extends React.Component<any> {
    render() {
        return (
            <div className="App">
                <Button variant="contained" color="primary" onClick={() => this.test()}>
                    测试{this.props.nickname}
                </Button>
            </div>
        );
    }

    test() {
        this.props.history.push('/test');
    }
}
