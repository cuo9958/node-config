import React from "react";
import { render } from "react-dom";
import { Provider } from "mobx-react";
import { HashRouter } from "react-router-dom";

import stores from "./models/index";
import getRoutes from "./routes";
import * as serviceWorker from "./serviceWorker";
import "./index.css";
import "element-theme-default";

class App extends React.Component {
    constructor(props: any) {
        super(props);
        stores.user.check();
    }
    render() {
        return (
            <Provider {...stores}>
                <HashRouter ref="navigator">{getRoutes()}</HashRouter>
            </Provider>
        );
    }
}

render(<App />, document.getElementById("root"));

serviceWorker.unregister();
