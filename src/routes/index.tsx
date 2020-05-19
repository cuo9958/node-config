import React from "react";
import { withRouter, Switch } from "react-router-dom";
import Auth from "./Auth";

import Layout from "../pages/layout";

const Main = withRouter((props: any) => <Layout {...props} />);

export default () => {
    return (
        <Main>
            <Switch>
                <Auth />
            </Switch>
        </Main>
    );
};
