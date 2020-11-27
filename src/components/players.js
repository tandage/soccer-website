import React, {Component} from 'react';
import Player from "./player";

export default class Players extends Component {
    constructor(props) {
        super(props);
        this.state = {
            players: []
        }
    }

    componentDidMount() {
        const url = "https://randomuser.me/api/?results=22&nat=ie"
        fetch(url)
            .then(data => data.json()
            )
            .then(data => {
                this.setState({
                    players: data.results.map((value) => {
                        value["score"] = 0
                        return value
                    })
                })
            })
    }

    add(id) {
        this.setState(() => ({
            players: this.state.players.map((value => {
                if (value.id.value == id) {
                    value.score += 1
                }
                return value
            }))
        }))
    }

    del(id) {
        const players = this.state.players.filter((value => {
            if (value.id.value === id) {
                return false
            }
            return true
        }))
        this.setState({players})
    }

    filterByNameOrScore(keyword) {
        return (piece) => {
            if (!keyword || keyword === "")
                return true
            const fullName = (piece.name.last).toLowerCase()
            if (fullName.includes(keyword.toLowerCase()))
                return true
            return false
        }
    }

    render() {

        return (
            <div className="mt-5 d-flex flex-wrap justify-content-between">

                {this.state.players.filter(this.filterByNameOrScore(this.props.searchContent)).map((player, index) => {
                    return (<Player del={this.del.bind(this)} add={this.add.bind(this)}  player={player}
                                    key={index}></Player>)
                })}
            </div>

        )
    }
}
