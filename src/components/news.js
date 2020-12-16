import React, {Component} from 'react';
import {Link, } from "react-router-3";
import New from "./new";
import MyCarousel from "./carousel"

export default class News extends Component {
    constructor(props) {
        super(props);
        this.state = {
            news: [],
            key: "4aabba530384428b839feb21cb30101e",
            country: "us",
            url: "https://newsapi.org/v2/top-headlines",
            page: 0,
            subset: [],
        }
    }

    componentDidMount() {
        this.getArticles()

    }
     getRandomArrayElements(arr, count) {
        let shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
        while (i-- > min) {
            index = Math.floor((i + 1) * Math.random());
            temp = shuffled[index];
            shuffled[index] = shuffled[i];
            shuffled[i] = temp;
        }
        return shuffled.slice(min);
    }

    getArticles() {
        const requestUrl = `${this.state.url}?country=${this.state.country}&apiKey=${this.state.key}
        &page=${this.state.page}&pageSize=20&category=sports`
        fetch(requestUrl)
            .then(response => {
                return response.json()
            })
            .then(data => {
                this.setState(prev => ({
                        news: [...prev.news, ...data["articles"]],
                        page: prev.page+1,
                        subset: this.getRandomArrayElements(data["articles"].filter((item)=>{return item.urlToImage!=null}),3)
                    })
                )

            })
    }



    render() {
        return (
            <div >

                <MyCarousel objs={this.state.subset} />
                <div className="list-group">
                    {this.state.news.map((value, index) => {
                        const LinkUrl = "/new/" + index
                        return <Link to={{pathname: LinkUrl, query: value}}
                                     className="list-group-item list-group-item-action">
                            <New n={value} key={index}/>
                        </Link>
                    })}

                </div>
                <div>
                    <a className="btn btn-block btn-outline-dark mt-3" onClick={this.getArticles.bind(this)}>load
                        next</a>
                </div>
            </div>
        )
    }
}
