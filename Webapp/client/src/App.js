import "./components/styles/App.css";
import Header from "./components/component/Header";
import Intial from "./components/component/Intial";
import Homepage from "./components/component/Homepage";
import Error from "./components/component/Error";
import React from "react";
import { BrowserRouter as Router, Route, Routes, BrowserRouter} from 'react-router-dom';

function App() {

  return (
    <BrowserRouter>
        <Header/>
        <Routes>
          <Route path="/" exact element = {<Intial/>} />
          <Route path = "/homepage" element = {<Homepage/>} />
          <Route path = "*" element = {<Error/>} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
