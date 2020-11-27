import React, {Component, createContext} from 'react';
import Posts from "./posts";
import Alter from "./alter";
export default class NewDetail extends Component {

    constructor(props) {
        super(props);
        this.state ={
            n:this.props.location.query,

        }
        console.log(this.state.n)
    }

    render() {

        return (
             <div>

                 <div className="jumbotron jumbotron-fluid bg-white" >
                     <div className="container">
                         <h1 className="lead display-4 mt-0 font-weight-bolder"><b>{this.state.n.title} </b></h1>
                         <p className="lead text-right  font-italic"><b>{this.state.n.publishedAt}</b> </p>
                         <p className="lead text-right mb-0 pb-0 font-italic "><b>{this.state.n.author|| "Anonymous"}</b> </p>
                     </div>
                 </div>
                 <img className="mb-1 img-fluid" src={this.state.n.urlToImage}></img>
                 <p className="my-3 lead bg-light text-break">
                     {this.state.n.content ||  this.state.n.url}
                 </p>
                 <Posts isLogin={this.props.isLogin} username={this.props.username}/>

             </div>
        )
    }
}
