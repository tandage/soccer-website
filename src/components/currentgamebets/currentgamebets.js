import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    fetchCurrentFixturesByDate,
} from "./currentgamebetsSlice";
import moment from "moment";

import {keysInHeadersOfFootballAPI} from "../../app/secure";
import {useHistory} from "react-router";
import Modal from "../modal/modal";

const judge_st_order = (object) => {
    if (!object || !object.statusShort)
        return false
    return (object.statusShort === "PST" || object.statusShort === "CANC" || object.statusShort === "NS")
}

const order_by_statusShort = (a, b) => {
    if (judge_st_order(a))
        return 1
    else if (judge_st_order(b))
        return -1
    else if (!judge_st_order(a))
        return -1
    else if (!judge_st_order(b))
        return 1
    else
        return 0
}

const CurrentGameBets = ({fixtures}) => {

    const dispatch = useDispatch()
    const [currentFixtures, setCurrentFixtures] = useState([])
    const [showFullInfo, setShowFullInfo] = useState({})
    const [searchContent, setSearchContent] = useState("")
    let _currentFixtures = useSelector(state => state.currentFixtures.fixtures) || []

    if (fixtures)
        _currentFixtures = fixtures

    useEffect(() => {
        if ((_currentFixtures == null || _currentFixtures.length === 0) && !fixtures)
            dispatch(fetchCurrentFixturesByDate())
        const t_currentFixtures = [..._currentFixtures]
        t_currentFixtures.sort((former, latter) => order_by_statusShort(former, latter))
        setCurrentFixtures(t_currentFixtures)
    }, [_currentFixtures])

    // const fetch_fixtures_by_team_id = async () => {
    //     const url = `https://api-football-v1.p.rapidapi.com/v2/fixtures/team/${team_id}?timezone=Europe%2FLondon`
    //     const response = await fetchHttpAPI(url, {
    //         method: 'GET',
    //         headers: keysInHeadersOfFootballAPI
    //     })
    //
    //     let list = response.api.fixtures
    //     const len = list.length <= 30 ? list.length : 30
    //     list = list.slice(list.length - len, list.length)
    //     await setCurrentFixtures(currentFixtures.concat(list))
    //     await dispatch(set_t_fixtures(list))
    //     setShow(false)
    // }

    const is_match = (currentFixture) => {
        const q = searchContent.toLowerCase()
        if (currentFixture)
            return (currentFixture.homeTeam.team_name.toLowerCase().includes() ||
                currentFixture.awayTeam.team_name.toLowerCase().includes(q) ||
                currentFixture.league.name.toLowerCase().includes(q) ||
                currentFixture.league.country.toLowerCase().includes(q) ||
                currentFixture.round.toLowerCase().includes(q) ||
                currentFixture.status.toLowerCase().includes(q) ||
                currentFixture.statusShort.toLowerCase().includes(q) ||
                (currentFixture.referee && currentFixture.referee.toLowerCase().includes(q)))

    }

    return (

        <div className="card bg-light bg-gradient"
             style={{overflow: 'scroll', height: '50em'}}>
            <div className="card-header text-center">
                <input className="form-control " type="text" placeholder="search" value={searchContent}
                       onChange={(e) => setSearchContent(e.target.value)}/>
            </div>

            <div className="list-group">
                {currentFixtures.map((currentFixture, index) => {
                        if (is_match(currentFixture))
                            return <CurrentGameBet key={index} currentFixture={currentFixture} showFullInfo={showFullInfo}
                                                   setShowFullInfo={setShowFullInfo}/>
                    }
                )}
            </div>
        </div>
    )
}

const CurrentGameBet = ({currentFixture, showFullInfo, setShowFullInfo}) => {
    const history = useHistory()
    const [show, setShow] = useState(false)
    const [lineUps, setLineUps] = useState([])
    const [odds, setOdds] = useState([])
    const {fixture_id, league, event_date, homeTeam, awayTeam, elapsed, venue, referee, statusShort, score, round, firstHalfStart, secondHalfStart} = currentFixture
    const t = moment(event_date)
    const firstHalfStart_t = "FHS:" + moment(firstHalfStart * 1000).format('LT')
    const secondHalfStart_t = "SHS:" + moment(secondHalfStart * 1000).format('LT')
    const elapsed_t = "elapsed: " + elapsed + " mins"
    const venue_t = "venue: " + venue
    const round_t = "round: " + round
    const referee_t = referee ? "referee: " + referee : null
    const calendarTime = t.calendar()
    const fetch_data = async (fixture_id, url) => {

        const response = await fetch(url, {
            method: 'GET',
            headers: keysInHeadersOfFootballAPI,
        })
        const data = await response.json()
        return data
    }
    const is_showFullInfo = async () => {
        let lineUps = await fetch_data(fixture_id, `https://api-football-v1.p.rapidapi.com/v2/lineups/${fixture_id}`)
        if (lineUps && lineUps.api){
            lineUps = Object.values(lineUps.api.lineUps)
            setLineUps(lineUps)
        }

        let odds = await fetch_data(fixture_id, `https://api-football-v1.p.rapidapi.com/v2/odds/fixture/${fixture_id}`)

        if (odds && odds.api && odds.api.odds.length !== 0 && odds.api.odds[0].bookmakers.length !== 0)
            setOdds(odds.api.odds[0].bookmakers[0].bets)

        let t = {...showFullInfo}
        if (showFullInfo[fixture_id])
            t[fixture_id] = false
        else
            t[fixture_id] = true
        setShowFullInfo(t)

    }

    return (
        <>
            <div className="list-group-item list-group-item-action ">

                <div className="container ">
                    <div className="d-flex align-items-center justify-content-between  text-truncate mb-5 flex-wrap">
                        <div className="text-wrap">
                            <img src={league.flag || league.logo} style={{height: "1rem", weight: "1rem"}}
                                 className='me-3'/>
                            <span className="me-2 fw-bold">{calendarTime}</span>
                            <span className="me-2 fw-bold">{league.name}</span>
                            <span className="me-2 fw-bold text-danger">{statusShort}</span>
                        </div>

                        {!judge_st_order(currentFixture) &&
                        <small className="btn btn-link text-decoration-none text-muted fst-italic fw-bolder"
                               onClick={() => {
                                   if (!judge_st_order(currentFixture)) setShow(true)
                               }}>
                            prediction→</small>}
                    </div>

                    <div className="d-flex justify-content-between align-items-center ">
                        <figure className="figure text-center">
                            <img src={homeTeam.logo} className="figure-img img-fluid rounded" alt=""
                                 style={{height: "3rem", weight: "3rem"}} onClick={(e) => {
                                e.stopPropagation()
                                history.push("/team/" + homeTeam.team_id)
                            }}/>
                            <figcaption className="figure-caption fs-6 text-muted fst-italic text-wrap"
                                        style={{width: "7rem"}}>{homeTeam.team_name}</figcaption>
                            {!judge_st_order(currentFixture) &&
                            <figcaption className="figure-caption fs-6 text-danger  fst-italic text-wrap"
                                        style={{width: "7rem"}}>{currentFixture.goalsHomeTeam}</figcaption>}
                        </figure>
                        <span>VS</span>
                        <figure className="figure text-center">
                            <img src={awayTeam.logo} className="figure-img img-fluid rounded" alt=""
                                 style={{height: "3rem", weight: "3rem"}} onClick={(e) => {
                                e.stopPropagation()
                                history.push("/team/" + awayTeam.team_id)
                            }}/>
                            <figcaption className="figure-caption fs-6 text-muted fst-italic "
                                        style={{width: "7rem"}}>{awayTeam.team_name}</figcaption>
                            {!judge_st_order(currentFixture) &&
                            <figcaption className="figure-caption fs-6  text-danger  fst-italic "
                                        style={{width: "7rem"}}>{currentFixture.goalsAwayTeam}</figcaption>}
                        </figure>
                    </div>

                    <div className="text-center mt-5 ms-auto fw-bold" onClick={(e) => {
                        is_showFullInfo()
                    }}>
                        {!judge_st_order(currentFixture) &&
                        <small
                            className="btn btn-link text-decoration-none text-muted fst-italic fw-bolder">{showFullInfo[currentFixture.fixture_id] ? "↑ click me" : "↓ click me"}</small>}
                    </div>

                    {!judge_st_order(currentFixture) && showFullInfo[currentFixture.fixture_id] &&
                    <>

                        <div className="accordion accordion-flush" id="accordionFlushExample">
                            <div className="accordion-item">
                                <h2 className="accordion-header" id="flush-headingOne">
                                    <button className="accordion-button collapsed" type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#flush-collapseOne" aria-expanded="false"
                                            aria-controls="flush-collapseOne">
                                        Basic Info
                                    </button>
                                </h2>
                                <div id="flush-collapseOne" className="accordion-collapse collapse"
                                     aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
                                    <div className="d-flex justify-content-between my-2  flex-nowrap">
                                        <div className="d-flex flex-column ms-1">

                                            {[elapsed_t, firstHalfStart_t, secondHalfStart_t, round_t, venue_t, referee_t].map((item, index) => {
                                                    if (item) return <small className=" me-2 fw-normal fst-italic"
                                                                            key={index}>{item}</small>
                                                }
                                            )}
                                        </div>
                                        <div className="d-flex flex-column align-items-center ms-1 text-end">
                                            {showFullInfo[currentFixture.fixture_id] && Object.entries(score).map((item, index) => {
                                                    if (item && item[0] && item[1]) return <small
                                                        className=" me-2 fw-bolder text-warning"
                                                        key={index}>{item[0]} : {item[1]}</small>
                                                }
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {lineUps.length !== 0 && <div className="accordion-item">
                                <h2 className="accordion-header" id="flush-headingTwo">
                                    <button className="accordion-button " type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#flush-collapseTwo" aria-expanded="false"
                                            aria-controls="flush-collapseTwo">
                                        Players
                                    </button>
                                </h2>

                                <div id="flush-collapseTwo" className="accordion-collapse collapse"
                                     aria-labelledby="flush-headingTwo" data-bs-parent="#accordionFlushExample">
                                    <div className="card mb-2">
                                        <div className="card-header d-flex justify-content-between">
                                            <span>{lineUps[0].coach}</span>
                                            <span>{lineUps[0].formation}</span>
                                        </div>
                                        <ul className="list-group list-group-horizontal flex-wrap ">
                                            {lineUps[0].startXI.map(item => (
                                                <li className="list-group-item">{item.player} {item.number} {item.pos}</li>))}
                                        </ul>
                                    </div>

                                    <div className="card">
                                        <div className="card-header d-flex justify-content-between">
                                            <span>{lineUps[1].coach}</span>
                                            <span>{lineUps[1].formation}</span>
                                        </div>
                                        <ul className="list-group list-group-horizontal flex-wrap ">
                                            {lineUps[1].startXI.map(item => (
                                                <li className="list-group-item">{item.player} {item.number} {item.pos}</li>))}
                                        </ul>
                                    </div>


                                </div>
                            </div>}
                            {odds && <div className="accordion-item">
                                <h2 className="accordion-header" id="flush-headingThree">
                                    <button className="accordion-button collapsed" type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#flush-collapseThree" aria-expanded="false"
                                            aria-controls="flush-collapseThree">
                                        Odds
                                    </button>
                                </h2>

                                <div id="flush-collapseThree" className="accordion-collapse collapse"
                                     aria-labelledby="flush-headingThree" data-bs-parent="#accordionFlushExample">
                                    <div className="accordion-body">
                                        <table className="table table-hover table-striped table-responsive table-sm">
                                            <thead>
                                            <tr>
                                                <th scope="col">Betting</th>
                                                <th scope="col">object</th>
                                                <th scope="col">odd</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {odds.map(odd => {

                                                return odd.values.map(item => (<tr>
                                                    <th scope="row">{odd.label_name}</th>
                                                    <td>{item.value}</td>
                                                    <td>{item.odd}</td>
                                                </tr>))
                                            })}
                                            </tbody>
                                        </table>

                                    </div>
                                </div>
                            </div>}
                        </div>
                    </>}


                </div>

            </div>
            <Modal title={currentFixture.round} onClose={() => setShow(false)} show={show}
                   fixture_id={currentFixture.fixture_id}>

            </Modal>
        </>)
}


export default CurrentGameBets
