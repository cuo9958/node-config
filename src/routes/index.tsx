import React from 'react';
import { withRouter, Switch, Route } from 'react-router-dom';

import Layout from '../pages/layout/index';
import configs from './config';

const Main = withRouter((props: any) => <Layout {...props} />);

export default class extends React.Component {
    render() {
        return (
            <Main>
                <Switch>
                    {configs.map(item => (
                        <Route key={item.name} path={item.path} exact={!!item.exact} component={item.page} />
                    ))}
                </Switch>
            </Main>
        );
    }
}
