import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, hashHistory, Redirect, IndexRoute} from "react-router-3"
import App from './App';
import About from "./about";
import News from "./components/news";
import NewDetail from "./components/newdetail";
import Favorite from "./components/favorite";
import "./static/basic.css"
ReactDOM.render(

    (<Router history={hashHistory}>
            <Route path="/" component={App}>
                <IndexRoute component={News}/>
                <Route path="new/:id" component={NewDetail} />
                <Route path="favorite" component={Favorite} />
                <Route path="about" component={About}/>
            </Route>
        </Router>
    ),
    document.getElementById('root')
);



