import "./components/styles/App.css";
import Header from "./components/component/Header";
import Intial from "./components/component/Intial";
import Homepage from "./components/component/Homepage";
import { useEffect } from "react";
import React from "react";
import axios from "axios";

function App() {
  // const [data, setData] = React.useState(null);

  // useEffect(() => {
  //   fetch("/get-entries")
  //     .then((res) => res.json())
  //     .then((data) => setData(data.message));
  // }, []);
  axios({
    method: "get",
    url: "http://localhost:5001/logicdesign-project/us-central1/app/get-entries",
    // data: {
    //   message: "Hello",
    // },
  })
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error);
    });

  return (
    <div>
      <Header />
      <Homepage />
    </div>
  );
}

export default App;
