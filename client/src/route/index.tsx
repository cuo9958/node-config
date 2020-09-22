import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Layout from '../pages/layout';
import configs from './config';

export default function () {
    return (
        <Switch>
            {configs.map((item) => (
                <Route
                    key={item.name}
                    path={item.path}
                    exact={item.exact || item.exact === undefined}
                    component={(props: any) => {
                        if (item.layout)
                            return (
                                <Layout {...props} active={item.path}>
                                    <item.page {...props} />
                                </Layout>
                            );
                        return <item.page {...props} />;
                    }}
                />
            ))}
        </Switch>
    );
}
