import React, {Component} from 'react';
import Post from "./post";
import {Modal,Button} from "react-bootstrap";
import Alter from "./alter";

export default class Posts extends Component {

    constructor(props) {
        super(props);
        this.state = {
            posters: [],
            textareaContent:"",
            show:false,
            text:""
        }
    }

    componentDidMount() {
        const  url = "https://newsapi.org/v2/sources?apiKey=4aabba530384428b839feb21cb30101e"
        fetch(url)
            .then(data=>data.json()
            )
            .then(posters=>{
                this.setState({
                    posters:posters.sources
                })
            })
    }

    render() {
        return (
            <div>

                <form>
                    <div className="form-group my-5 text-right" >
                        <label htmlFor="textarea " className="text-secondary">come to have a nice comment !</label>
                        <textarea className="form-control" id="textarea" rows="3" value={this.state.textareaContent} onChange={(e)=>this.setState({textareaContent:e.target.value})}></textarea>
                        <a className="btn  btn-sm mt-2 btn-outline-secondary " onClick={()=>{

                            if (!this.props.isLogin){
                                this.setState({show:true,text:"Please login first !"})
                                return
                            }
                            this.setState(
                                (prev)=>({posters:[...prev.posters,
                                        {name:this.props.username,index:this.state.posters.length,description:this.state.textareaContent}],
                                    textareaContent:"",
                                    text:"comments published successful !",
                                    show:true,
                                }))
                        }}>
                            submit comment</a>
                    </div>
                </form>
                {this.state.posters.map((value, index) => {
                    return <Post poster={value} key={index} index={index}></Post>
                })}
                <Alter show={this.state.show} handleClose={()=>{this.setState({show:false})} } text={this.state.text}/>
            </div>
        )
    }
}
