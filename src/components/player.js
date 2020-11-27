import React, {useState} from "react";

export default  function Player (props){

    const add =()=>{
        props.add(props.player.id.value)
    }
    const del = ()=>{
        props.del(props.player.id.value)
    }
    return (<div className="mb-1 mr-2 mt-5 ">

        <div  className="card" style={{width:"7rem"}}>
            <button type="button" className="close text-right" onClick={del} >
                &times;
            </button>

                <img className="card-img-top img-thumbnail h-75 mb-0 pb-0" src={props.player.picture.thumbnail} ></img>
                <div className="card-body mt-0 pt-1 text-center"  onClick={add}>
                    <b className="mt-0">{props.player.name.last}  </b>
                    <hr className="my-1"/>
                    <i className="text-warning"> {props.player.score}</i>
                    <hr className="my-1"/>
                </div>

        </div>
    </div>)
}