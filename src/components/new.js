import React, {Component} from 'react';

export default class New extends Component {
    constructor(props) {
        super(props);
        this.state ={
            n: this.props.n
        }
    }
    render() {
        return (
            <div>
                <div className="media">

                    <img src={this.state.n.urlToImage} className="mr-3 img"  alt="..."/>
                    <div className="media-body">
                        <h5 className="mt-0">{this.state.n.title}</h5>
                        <p>{this.state.n.description}</p>
                        <blockquote className="blockquote mb-0 text-right">
                            <footer className="blockquote-footer"><cite >{this.state.n.source.name}</cite></footer>
                        </blockquote>
                    </div>
                </div>
            </div>
        )
    }
}
