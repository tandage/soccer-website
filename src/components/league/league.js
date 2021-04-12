import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {HomeNewsList} from "../newslist/newslist";
import {CardList} from "../cardlist/cardlist";
import CurrentGameBets from "../currentgamebets/currentgamebets";
import {useRouteMatch} from "react-router";
import {fetchTeamFixtures, fetchTeamLeagues, fetchTeamStatistics} from "../currentgamebets/currentgamebetsSlice";
import {keysInHeadersOfFootballAPI} from "../../app/secure";

const fetch_data = async (fixture_id, url) => {

    const response = await fetch(url, {
        method: 'GET',
        headers: keysInHeadersOfFootballAPI,
    })
    const data = await response.json()
    return data
}
const Head = ({league, id}) => {
    const [standings, setStandings] = useState([])
    const [standing, setStanding] = useState([])

    const change_option = (e) => {
        const name = e.target.value.split(" ")[1]
        const standing_t = standings.find(standing => standing.teamName.includes(name) )
        const names = Object.keys(standing_t.all)
        const values_all = Object.values(standing_t.all)
        const values_home = Object.values(standing_t.home)
        const values_away = Object.values(standing_t.away)
        const data = []
        for (let i = 0; i < name.length; i++) {
            data.push([names[i], values_all[i], values_home[i], values_away[i]])
        }
        setStanding(data)
    }
    useEffect(async () => {
        if (standings.length === 0) {
            const standings_t = await fetch_data(id, `https://api-football-v1.p.rapidapi.com/v2/leagueTable/${id}`)
            setStandings(standings_t.api.standings[0])
        }
    }, [id])

    return (
        <div className="container-fluid mb-1 bg-light d-flex justify-content-between">
            <figure className="figure">
                <picture>
                    <source srcSet={league.logo} type="image/svg+xml" className="figure-img img-fluid rounded"/>
                    <img src={league.flag} className="figure-img img-fluid rounded" alt="none"/>
                </picture>
                <figcaption className="figure-caption text-center fst-italic fw-bolder">{league.name}</figcaption>
            </figure>

            <div>
                <select className="form-select form-select-sm" aria-label=".form-select-sm example"
                        onChange={(e) => change_option(e)}>

                    {standings.map((item, index) => {
                        if (index == 0)
                            return <option defaultValue key={index}
                                           value={item.league_id}>
                                {"No." + item.rank + " " + item.teamName}
                            </option>

                        return <option key={index}
                                       value={item.league_id}>
                            {"No." + item.rank + " " + item.teamName}
                        </option>
                    })}

                </select>
                <div>
                    <table className="table table-hover table-striped table-responsive table-sm">
                        <thead>
                        <tr>
                            <th scope="col">Data</th>
                            <th scope="col">All</th>
                            <th scope="col">Home</th>
                            <th scope="col">Away</th>
                        </tr>
                        </thead>
                        <tbody>
                        {standing.map(item => {
                            return (<tr>
                                <th scope="row">{item[0]}</th>
                                <td>{item[1]}</td>
                                <td>{item[2]}</td>
                                <td>{item[3]}</td>
                            </tr>)
                        })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

const League = () => {

    const [fixtures, setFixtures] = useState([])
    const [league, setLeague] = useState(null)
    const [topScorers, setTopScorers] = useState([])
    const [teams, setTeams] = useState(null)
    const {id} = useParams()

    useEffect(async () => {
        if (fixtures.length === 0) {
            const fixtures = await fetch_data(id, `https://api-football-v1.p.rapidapi.com/v2/fixtures/league/${id}`)
            setFixtures(fixtures.api.fixtures)
        }

        if (topScorers.length === 0) {
            const topScorers = await fetch_data(id, `https://api-football-v1.p.rapidapi.com/v2/topscorers/${id}`)
            console.log(topScorers.api.topscorers)
            setTopScorers(topScorers.api.topscorers)
        }

        if (!teams) {
            const teams = await fetch_data(id, `https://api-football-v1.p.rapidapi.com/v2/teams/league/${id}`)

            setTeams(teams.api.teams)
        }

        if (!league) {
            const league = await fetch_data(id, `https://api-football-v1.p.rapidapi.com/v2/leagues/league/${id}`)
            setLeague(league.api.leagues[0])
        }

    }, [id])

    return (
        <>
            <div className="row row-cols-2 d-flex mt-1 justify-content-center flex-nowrap">
                <div className="col-9  ">
                    {league && <Head league={league} id={id}></Head>}
                    {/*<CurrentGameBets fixtures={fixtures}/>*/}
                </div>
                <div className="col-3 ">
                    <HomeNewsList q={league ? league.name : null}/>

                        <CardList list={teams} label="team" />


                        <CardList list={topScorers} label="topScorer"/>

                </div>
            </div>
        </>

    )
}


export default League
