import React, {Component} from 'react';
import Players from "./players";

export default class Favorite extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchContent:""
        }
    }



    render() {
        return (
            <div className="container bg-light">
                <div className="jumbotron jumbotron-fluid bg-white" >
                    <div className="container">
                        <h1 className="lead display-4 mt-0 text-center"><b>Vote For Your Favorite</b></h1>
                    </div>
                </div>
                <div className="input-group mb-5 mt-5">
                    <div className="input-group-prepend mr-5 ">
                        <button className="input-group-text bg-info text-light">Search</button>
                    </div>
                    <input onChange={(e)=>this.setState({
                        searchContent:e.target.value
                    })} type="text" className="form-control" placeholder="eg . player's name" />
                </div>
                <Players searchContent={this.state.searchContent}/>
            </div>
        )
    }
}
