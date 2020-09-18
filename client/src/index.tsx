import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import './index.css';

import { Provider } from 'mobx-react';
import stores from './models';

import Routes from './route';

ReactDOM.render(
    <>
        <CssBaseline />
        <Provider {...stores}>
            <HashRouter>{Routes()}</HashRouter>
        </Provider>
    </>,
    document.getElementById('root')
);
