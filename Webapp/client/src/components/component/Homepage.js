import React, { useEffect, useState, useMemo, useRef } from 'react';
//import OSmap from './OSmap';
import axios from 'axios';
import {MapContainer, TileLayer, Map, useMap, Marker, Popup} from 'react-leaflet';
import L from 'leaflet'

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

    const mapRef = useRef();

    function handleOnSetView() {
        const { current = {} } = mapRef;
        const { leafletElement: map } = current;
        map.setView([data[i].lat, data[i].lon], 14);
    }

    const markerIcon = new L.Icon({
        iconUrl: require("../source/Icon-meo-cute.jpg"),
        iconSize: [35,45],
        iconAnchor: [17,46],
        popupAnchor: [0,-46],
    })

    function formatDate(date) {
        var year = date.getFullYear().toString();
        var month = (date.getMonth() + 101).toString().substring(1);
        var day = (date.getDate() + 100).toString().substring(1);
        return month + '/' + day + '/' + year;
    }

    function formatTime(date) {
        var hours = date.getHours().toString();
        var minutes = date.getMinutes().toString();
        var seconds = date.getSeconds().toString();
        return hours + ':' + minutes + ':' + seconds;
    }

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
                    <span>Latitude: <span className="bold italic"> {data[i].lat} </span> </span> <br/>
                    <span>Longitude: <span className="bold italic"> {data[i].lon} </span> </span> <br/>
                    <span>Time: <span className="bold italic"> {
                        formatDate(new Date(data[i].time._seconds * 1000)) + ' ' + formatTime(new Date(data[i].time._seconds * 1000))
                    } </span> </span> <br/>
                </p>

                <div>
                    <MapContainer ref = {mapRef} center={[data[i].lat, data[i].lon]} zoom={14} scrollWheelZoom={true}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position = {[data[i].lat, data[i].lon]} icon = {markerIcon} center = {true}>
                            <Popup> 
                                <b>Hello I'm here</b>
                            </Popup>
                        </Marker>
                    </MapContainer>
                    <p className = "p4">Location on Google Maps</p>
                </div>

                <div className="col">
                    <div className="row justify-content-center">
                        <div className="col-16 transbox">
                            <div className="list-group" id="list-tab" role="tablist">
                                <a className="list-group-item list-group-item-action active" id="list-home-list" data-bs-toggle="list" href="#list-home" role="tab" aria-controls="list-home" onClick={() => {
                                    handleOnSetView();
                                    setI(0);
                                }}>Time : {formatDate(new Date(data[0].time._seconds * 1000)) + ' ' + formatTime(new Date(data[0].time._seconds * 1000))}</a>
                                <a className="list-group-item list-group-item-action" id="list-profile-list" data-bs-toggle="list" href="#list-profile" role="tab" aria-controls="list-profile" onClick={() => {
                                    handleOnSetView();
                                    setI(1);
                                }}>Time: {formatDate(new Date(data[1].time._seconds * 1000)) + ' ' + formatTime(new Date(data[1].time._seconds * 1000))}</a>
                                <a className="list-group-item list-group-item-action" id="list-messages-list" data-bs-toggle="list" href="#list-messages" role="tab" aria-controls="list-messages" onClick={() => {
                                    handleOnSetView();
                                    setI(2);
                                }}>Time: {formatDate(new Date(data[2].time._seconds * 1000)) + ' ' + formatTime(new Date(data[2].time._seconds * 1000))} </a>
                                <a className="list-group-item list-group-item-action" id="list-settings-list" data-bs-toggle="list" href="#list-settings" role="tab" aria-controls="list-settings" onClick={() => {
                                    handleOnSetView();
                                    setI(3);
                                }}>Time: {formatDate(new Date(data[3].time._seconds * 1000)) + ' ' + formatTime(new Date(data[3].time._seconds * 1000))} </a>
                                <a className="list-group-item list-group-item-action" id="list-messages-list" data-bs-toggle="list" href="#list-messages" role="tab" aria-controls="list-messages" onClick={() => {
                                    handleOnSetView();
                                    setI(4);
                                }}>Time: {formatDate(new Date(data[4].time._seconds * 1000)) + ' ' + formatTime(new Date(data[4].time._seconds * 1000))}</a>
                                <a className="list-group-item list-group-item-action" id="list-settings-list" data-bs-toggle="list" href="#list-settings" role="tab" aria-controls="list-settings" onClick={() => {
                                    handleOnSetView();
                                    setI(5);
                                }}>Time: {formatDate(new Date(data[5].time._seconds * 1000)) + ' ' + formatTime(new Date(data[5].time._seconds * 1000))}</a>
                                <a className="list-group-item list-group-item-action" id="list-messages-list" data-bs-toggle="list" href="#list-messages" role="tab" aria-controls="list-messages" onClick={() => {
                                    setI(6)
                                }}>Time: {formatDate(new Date(data[6].time._seconds * 1000)) + ' ' + formatTime(new Date(data[6].time._seconds * 1000))}</a>
                            </div>
                        </div>
                    </div>
                    <span className="col justify-content-center size">Recent requested location</span>
                </div>
            </div>
    );  
}


