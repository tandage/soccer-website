import React from 'react';
import ReactDOM from 'react-dom';

import store from "./app/store";
import {Provider} from "react-redux"
import {
    BrowserRouter as Router,
    Route,
    Switch,
} from "react-router-dom";
import Home from "./components/home/home";
import NewDetail from "./components/newslist/newdetail/newdetail";
import Team from "./components/team/team";
import League from "./components/league/league";

ReactDOM.render(
    <Provider store={store}>
        <Router>
            <Switch>
                <Route exact path="/">
                    <Home />
                </Route>
                <Route  path="/newdetail/:id">
                    <NewDetail />
                </Route>
                <Route  path="/team/:id">
                    <Team />
                </Route>
                <Route  path="/league/:id">
                    <League />
                </Route>

            </Switch>
        </Router>
    </Provider>
    , document.getElementById('root')
);


