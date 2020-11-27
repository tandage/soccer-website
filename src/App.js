import React, {Component} from 'react';
import {IndexLink, Link} from "react-router-3";
import './static/bootstrap.css';

class App extends Component {


    constructor(props) {
        super(props);
         this.state = {
            username: "",
            password: "",
            isLogin: false
        };
    }

    login() {
        this.setState({
            isLogin:true
        })
    }

    render() {

        return (
            <div className="container">
                <div>

                    <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top mb-3">
                        <IndexLink className="navbar-brand mr-5" to="/">Aluminium</IndexLink>

                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item ml-2"><Link className="nav-link" to="/favorite">favorite</Link></li>
                            <li className="nav-item ml-2"><Link className="nav-link" to="/about">about</Link></li>
                        </ul>

                        {
                             this.state.isLogin
                                ? <span className="navbar-text mr-5"><span className="mr-3 head font-weight-bolder">Welcome :</span>{this.state.username}</span>
                                : <form className="form-inline my-2 my-lg-0 " onSubmit={this.login.bind(this)}>
                                <input className="form-control mr-sm-2" type="text" placeholder="username"
                                       value={this.state.username} onChange={(e) => {
                                    this.setState({username: e.target.value})
                                }}/>
                                <input className="form-control mr-sm-2" type="password" placeholder="password"
                                       value={this.state.password} onChange={(e) => {
                                    this.setState({password: e.target.value})
                                }}/>
                                <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Login</button>
                            </form>
                        }
                    </nav>

                </div>

                {
                    this.props.children
                    && React.cloneElement(this.props.children,
                        {isLogin:this.state.isLogin,username:this.state.username})
                }


            </div>
        )
    }


}

export default App;
