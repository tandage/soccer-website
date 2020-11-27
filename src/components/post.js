import React, {Component} from 'react';
import Alter from "./alter";

export default class Post extends Component {
    constructor(props) {
        super(props);
        this.state ={
            poster: this.props.poster
        }
    }
    render() {
        return (
            <div className="mb-1">
                <div className="card">
                    <div className="card-header d-flex justify-content-between">
                        <h5>{this.state.poster.name}</h5>
                        <h6>#{this.props.index+1}</h6>
                    </div>
                    <div className="card-body">
                        <p className="card-text">{this.state.poster.description}</p>
                    </div>
                </div>

            </div>
        )
    }
}
