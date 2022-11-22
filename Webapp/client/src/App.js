import "./components/styles/App.css";
import Header from "./components/component/Header";
import Intial from "./components/component/Intial";
import Homepage from "./components/component/Homepage";
//import Map from './components/component/Map';
import { useEffect } from "react";
import React from "react";
import {Route, Switch} from 'react-router-dom';
import axios from "axios";

function App() {

  // const key = 'AIzaSyAylDi_XER6NnLSZtaASeirR9zY3Ievir4';

  return (
    <div>
      {/* <div className="App">
          <header>
            Map Demo
          </header>
          <Map 
            googleMapURL={"https://maps.googleapis.com/maps/api/js?key=${key}&callback"}
            loadingElement={<div style={{ height: '100%' }} />}
            containerElement={<div style={{ height: '90vh', margin: 'auto', border: '2px solid black' }} />}
            mapElement={<div style={{ height: '100%' }} />}
          />
      </div> */}
      {/* <Switch>
        <Route exact path="/" component = {Map}/>
      </Switch> */}
      <Header/>
      <Homepage/>
    </div>
  );
}

export default App;
