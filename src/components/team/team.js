import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {HomeNewsList} from "../newslist/newslist";
import {CardList} from "../cardlist/cardlist";
import CurrentGameBets from "../currentgamebets/currentgamebets";
import {useRouteMatch} from "react-router";
import {fetchTeamFixtures, fetchTeamLeagues, fetchTeamStatistics} from "../currentgamebets/currentgamebetsSlice";
import {keysInHeadersOfFootballAPI} from "../../app/secure";
const fetch_data = async (id, url) => {

    const response = await fetch(url, {
        method: 'GET',
        headers: keysInHeadersOfFootballAPI,
    })
    const data = await response.json()
    return data
}
const Head = ({team, id, leagues}) => {
    const dispatch = useDispatch()
    const league_id = !leagues && leagues.length === 0 ? leagues[0].league_id : 1
    const [team_statistic,setTeam_statistic] = useState(league_id)
    useEffect(async () => {
        if (leagues && leagues.length !== 0){
            const data = await fetch_data(id,`https://api-football-v1.p.rapidapi.com/v2/statistics/${team_statistic}/${id}`)
            setTeam_statistic(data.api)
        }
        dispatch(fetchTeamStatistics({team_id: id}))
    }, [id,leagues])


    const headlines = ["*"].concat()
    return (
        <div className="container-fluid mb-1 bg-light d-flex justify-content-between">
            <figure className="figure">
                <img src={team.logo} className="figure-img img-fluid rounded" alt="..."/>
                <figcaption className="figure-caption text-center fst-italic fw-bolder">{team.name}</figcaption>
            </figure>

            <div>
                <select className="form-select form-select-sm" aria-label=".form-select-sm example">

                    {leagues.map((item,index) => {
                        if (index == 0)
                            return <option defaultValue key={item.league_id}
                                value={item.league_id}>{item.name + " " + (item.country_code ? item.country_code : "") + " " + item.season}</option>
                        return <option key={item.league_id}
                            value={item.league_id}>{item.name + " " + (item.country_code ? item.country_code : "") + " " + item.season}</option>
                    })}

                </select>

                <table className="table">
                    <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">First</th>
                        <th scope="col">Last</th>
                        <th scope="col">Handle</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <th scope="row">1</th>
                        <td>Mark</td>
                        <td>Otto</td>
                        <td>@mdo</td>
                    </tr>
                    <tr>
                        <th scope="row">2</th>
                        <td>Jacob</td>
                        <td>Thornton</td>
                        <td>@fat</td>
                    </tr>
                    <tr>
                        <th scope="row">3</th>
                        <td colSpan="2">Larry the Bird</td>
                        <td>@twitter</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>)
}

const Team = () => {
    const {id} = useParams()
    const dispatch = useDispatch()
    const [transfers,setTransfers] = useState([])
    const [players,setPlayers] = useState([])
    const [leagues,setLeagues] = useState([])

    const currentFixtures = useSelector(state => state.currentFixtures.fixtures) || []
    const fixture = currentFixtures.filter(item => item.homeTeam.team_id == id || item.awayTeam.team_id == id)[0]
    const team = fixture.homeTeam.team_id == id ? fixture.homeTeam : fixture.awayTeam

    const t_fixtures = useSelector(state => state.currentFixtures.t_fixtures) || []

    useEffect(async () => {
        if (t_fixtures == null || t_fixtures.length === 0)
            dispatch(fetchTeamFixtures({team_id: id}))

        if (transfers.length === 0){
            const data = await fetch_data(id,`https://api-football-v1.p.rapidapi.com/v2/transfers/team/${id}`)
            setTransfers(data.api.transfers)
        }

        if (players.length === 0){
            const data = await fetch_data(id,`https://api-football-v1.p.rapidapi.com/v2/players/player/${id}`)
            console.log(data.api.players)
            setPlayers(data.api.players)
        }

        if (leagues.length === 0){
            let data = await fetch_data(id,`https://api-football-v1.p.rapidapi.com/v2/leagues/team/${id}`)
            data = data.api.leagues.reduce((acc,cur)=>{
                    if (!acc.some(item=>item.name === cur.name))
                        acc.push(cur)
                    return acc
                },[])
            setLeagues(data)
        }

    }, [id])

    return (
        <>
            <div className="row row-cols-2 d-flex mt-1 justify-content-center flex-nowrap">
                <div className="col-9  ">
                    <Head team={team} id={id} leagues={leagues}></Head>
                    <CurrentGameBets fixtures={t_fixtures}/>
                </div>
                <div className="col-3 ">
                    <HomeNewsList q={team.team_name}/>
                    {/*<div>*/}
                        <CardList list={leagues} label="league" />
                    {/*</div>*/}
                    {/*<div>*/}
                        <CardList list={players} label="player" />
                    {/*</div>*/}
                </div>
            </div>
        </>

    )
}


export default Team
