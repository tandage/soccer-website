import {useSelector} from "react-redux";
import {Link} from "react-router-dom";
import React, {useState} from "react";

const Piece = ({piece, q}) => {
    const {name, id} = piece

    let key = "league"
    if (piece.type)
        key = piece.type
    if (q === "awayTeam" || q === "homeTeam")
        key = "team"

    const LinkUrl = `/${key}/` + id

    return (<Link to={LinkUrl}
                  className="list-group-item list-group-item-action text-truncate">
        {name}
    </Link>)
}

const CardList = ({list, scrollable = false, label}) => {
    if (!list)
        return <></>
    let f = item => ({id: item.team_id, name: item.name})
    if (label === "topScorer")
        f= item => ({id:item.team_id,name:item.player_name})
    else if (label === "league")
        f = item => ({id:item.league_id,name:item.name})
    else if (label === "player")
        f = item => ({id:item.league_id,name:item.name})

    const len = list.length <= 8 ? list.length : 8
    const mappedList = list.map(f).slice(0, len)

    return (
        <div className="card my-2" style={scrollable ? {overflow: 'scroll', height: '20em'} : null}>
            <div className="list-group list-group-flush ">
                <div className="card-header d-flex justify-content-between">
                    <span className="badge bg-primary rounded-0 pl-0 ml-0 rounded-pill">{label}</span>

                </div>
                {
                    mappedList.map((piece, index) => {
                    return <Piece piece={piece} key={index} q={label}/>
                })}
            </div>
        </div>
    )
}


export {CardList, Piece}