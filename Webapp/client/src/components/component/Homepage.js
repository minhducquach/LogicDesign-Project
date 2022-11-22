import React, { useEffect, useState, useMemo } from 'react';
import OSmap from './OSmap';
import axios from 'axios';

export default function Homepage () {

    let array = [{
        id: "0",         
        time: "0",
        lat: "0",
        lon: "0",
    }, 
    {
        id: "1",
        time: "0",
        lat: "0",
        lon: "0",
    }, 
    {
        id: "2",
        time: "0",
        lat: "0",
        lon: "0",
    }, 
    {
        id: "3",
        time: "0",
        lat: "0",
        lon: "0",
    },
    {
        id: "4",
        time: "0",
        lat: "0",
        lon: "0",
    }, 
    {
        id: "5",
        time: "0",
        lat: "0",
        lon: "0",
    },
    {
        id: "6",
        time: "0",
        lat: "0",
        lon: "0",
    }];

    const [data, setData] = useState(array.reverse());
    const [i, setI] = useState(0);

    return (
            <div className="Grid">
                <p className="p1">
                    Hello, the person you are finding has just visited this place:<br />
                    <span className="bold italic">
                        <button type="button" className="btn btn-primary Button" 
                            onClick={() => {
                                axios({
                                    method: "get",
                                    url: "http://localhost:5001/logicdesign-project/us-central1/app/get-entries",
                                })
                                .then((response) => {
                                    array = response.data;
                                    setData(array);
                                    console.log(array);
                                })
                                .catch((error) => {
                                    console.log(error);
                                });
                                setI(0);
                            }}>
                            Click to take address
                        </button> 
                    </span>
                </p>
                <p className="p2">
                    <span>Id: <span className="bold italic"> {data[i].id} </span> </span> <br/>
                    <span>Latitude: <span className="bold italic"> {data[i].lat} </span> </span> <br/>
                    <span>Longitude: <span className="bold italic"> {data[i].lon} </span> </span> <br/>
                    <span>Time: <span className="bold italic"> {data[i].time} </span> </span> <br/>
                </p>
                <div>
                    <OSmap dataFromParent = {data[i]} />
                    <p className = "p4">Location on Google Maps</p>
                </div>
                <div className="col">
                    <div className="row justify-content-center">
                        <div className="col-16 transbox">
                            <div className="list-group" id="list-tab" role="tablist">
                                <a className="list-group-item list-group-item-action active" id="list-home-list" data-bs-toggle="list" href="#list-home" role="tab" aria-controls="list-home" onClick={() => setI(0)}>Time : {data[0].time}, Id: {data[0].id} </a>
                                <a className="list-group-item list-group-item-action" id="list-profile-list" data-bs-toggle="list" href="#list-profile" role="tab" aria-controls="list-profile" onClick={() => setI(1)}>Time: {data[1].time}, Id: {data[1].id} </a>
                                <a className="list-group-item list-group-item-action" id="list-messages-list" data-bs-toggle="list" href="#list-messages" role="tab" aria-controls="list-messages" onClick={() => setI(2)}>Time: {data[2].time}, Id: {data[2].id} </a>
                                <a className="list-group-item list-group-item-action" id="list-settings-list" data-bs-toggle="list" href="#list-settings" role="tab" aria-controls="list-settings" onClick={() => setI(3)}>Time: {data[3].time}, Id: {data[3].id} </a>
                                <a className="list-group-item list-group-item-action" id="list-messages-list" data-bs-toggle="list" href="#list-messages" role="tab" aria-controls="list-messages" onClick={() => setI(4)}>Time: {data[4].time}, Id: {data[4].id} </a>
                                <a className="list-group-item list-group-item-action" id="list-settings-list" data-bs-toggle="list" href="#list-settings" role="tab" aria-controls="list-settings" onClick={() => setI(5)}>Time: {data[5].time}, Id: {data[5].id} </a>
                                <a className="list-group-item list-group-item-action" id="list-messages-list" data-bs-toggle="list" href="#list-messages" role="tab" aria-controls="list-messages" onClick={() => setI(6)}>Time: {data[6].time}, Id: {data[6].id} </a>
                            </div>
                        </div>
                    </div>
                    <span className="col justify-content-center size">Recent requested location</span>
                </div>
            </div>
    );  
}

