import React from 'react';
import Button from '@material-ui/core/Button';
import { inject } from 'mobx-react';
import test from './test';

@inject((models: any) => ({
    nickname: models.user.nickname,
}))
export default class App extends React.Component<any> {
    constructor(props: any) {
        super(props);
        console.log(props);
    }
    render() {
        return (
            <div className="App">
                <Button variant="contained" color="primary" onClick={() => test()}>
                    测试{this.props.nickname}
                </Button>
            </div>
        );
    }

    test() {
        this.props.history.push('/test');
    }
}
