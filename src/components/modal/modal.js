import React, {useEffect, useState} from "react";
import ReactDOM from "react-dom";
import {CSSTransition} from "react-transition-group";
import "./modal.css";
import {keysInHeadersOfFootballAPI} from "../../app/secure";

const Modal = props => {
    const {fixture_id, show} = props

    const closeOnEscapeKeyDown = e => {
        if ((e.charCode || e.keyCode) === 27) {
            props.onClose();
        }
    };
    const fetch_data = async (fixture_id) => {
        const url = `https://api-football-v1.p.rapidapi.com/v2/predictions/${fixture_id}`
        const response = await fetch(url, {
            method: 'GET',
            headers: keysInHeadersOfFootballAPI,
        })
        const data = await response.json()
        return data

    }
    const [prediction, setPrediction] = useState(null)
    const [dataPairs, setDataPairs] = useState([])
    const [detail,setDetail] = useState(false)
    useEffect(async () => {
        if (show) {
            let fixture_prediction = await fetch_data(fixture_id)
            fixture_prediction = fixture_prediction.api.predictions[0]
            let names = ["win_home", "win_away", "win_total", "draw_home", "draw_away", "draw_total", "lost_home", "lost_away", "lost_total",]
            const comparison = Object.entries(fixture_prediction.comparison).reduce((acc, cur) => {
                acc.push([cur[0], cur[1].home, cur[1].away])
                return acc
            }, [])

            const matches = Object.entries(fixture_prediction.teams).reduce((acc, cur) => {
                let rates = []
                let data = Object.entries(cur[1].all_last_matches.matchs).reduce((acc_inner, cur_inner) => {
                    acc_inner.push([cur_inner[1].home, cur_inner[1].away, cur_inner[1].total])
                    return acc_inner
                }, [])
                for (let i = 1; i < data.length; i++) {
                    for (let j = 0; j < names.length / 3; j++)
                        rates.push((data[i][j] / data[0][j]).toFixed(2)*100+"%")
                }
                acc.push(rates)
                return acc
            }, [])

            const matches_with_names = []
            for (let i = 0; i < names.length; i++)
                matches_with_names.push([names[i], matches[0][i], matches[1][i]])

            const goalsAvg = Object.entries(fixture_prediction.teams).reduce((acc, cur) => {
                const rates = Object.entries(cur[1].all_last_matches.goalsAvg).reduce((acc_inner, cur_inner) => {
                    acc_inner.push(cur_inner[1].home, cur_inner[1].away, cur_inner[1].total)
                    return acc_inner
                }, [])
                acc.push(rates)
                return acc
            }, [])
            names = ["goalsAvg_home", "goalsAvg_away", "goalsAvg_total", "goalsAvg_home", "goalsAvg_away", "goalsAvg_total",]
            const goalsAvg_with_names = []
            for (let i = 0; i < names.length; i++)
                goalsAvg_with_names.push([names[i], goalsAvg[0][i], goalsAvg[1][i]])

            setDataPairs(comparison.concat(matches_with_names).concat(goalsAvg_with_names))

            setPrediction(fixture_prediction)
        }

    }, [fixture_id, show])

    useEffect(() => {
        document.body.addEventListener("keydown", closeOnEscapeKeyDown);
        return function cleanup() {
            document.body.removeEventListener("keydown", closeOnEscapeKeyDown);
        };
    }, []);


    return (
        <CSSTransition in={props.show} unmountOnExit timeout={{enter: 0, exit: 300}}>
            <div className="modal text-center " onClick={props.onClose}>
                <div className="modal-content" onClick={e => e.stopPropagation()}>
                    <div className="modal-header">
                        <h4 className="modal-title">{props.title}</h4>
                    </div>
                    <div className="modal-body container d-flex flex-column align-items-center w-100">

                        {prediction && !detail &&<><div className="d-flex justify-content-around my-2 flex-wrap">
                            <h1>{prediction.match_winner}</h1>
                            <h1> {prediction.advice}</h1>
                        </div>

                        <div className="d-flex justify-content-between align-items-center ">
                            <figure className="figure text-center">
                                <Text text={prediction.teams.home.team_name}></Text>
                                <Text text={prediction.winning_percent.home}></Text>
                            </figure>
                            <span>VS</span>
                            <figure className="figure text-center">
                                <Text text={prediction.teams.home.team_name}></Text>
                                <Text text={prediction.winning_percent.away}></Text>
                            </figure>
                        </div>

                        <div className="text-center mb-4">
                            <Text text={prediction.winning_percent.away}></Text>
                        </div></>}

                        {detail &&  <table className="table table-hover table-striped table-responsive table-sm">
                            <thead>
                            <tr>
                                <th scope="col">Attribute</th>
                                <th scope="col">Home</th>
                                <th scope="col">Away</th>
                            </tr>
                            </thead>
                            <tbody>
                            {dataPairs.map(pair => (<tr>
                                <th scope="row">{pair[0]}</th>
                                <td>{pair[1]}</td>
                                <td>{pair[2]}</td>
                            </tr>))}
                            </tbody>
                        </table>}

                    </div>
                    <div className="modal-footer">
                        <button onClick={()=>{ setDetail(!detail)}} className="btn btn-outline-dark btn-sm me-2">
                            {detail?"simple":"detail"}
                        </button>
                        <button onClick={props.onClose} className="btn btn-outline-dark btn-sm me-2">
                            got it
                        </button>
                    </div>
                </div>
            </div>
        </CSSTransition>
    )
}

const Text = ({text}) => {
    return (<figcaption className="figure-caption fs-6 text-muted fst-italic text-wrap"
                        style={{width: "7rem"}}>{text}</figcaption>)
}

export default Modal;
