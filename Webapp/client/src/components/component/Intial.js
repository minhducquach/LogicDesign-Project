import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";

export default function Intial() {
  return (
    <div>
      <div className="body">
        <div className="content-1">
          Hello, your relative's position doesn't show on our WebSite
        </div>
        <div className="content-2">Please click here to know!</div>
        <Link to="/homepage" id="none">
          <div
            className="click"
            onClick={() => {
              axios({
                method: "get",
                url: "http://127.0.0.1:5001/logicdesign-project/us-central1/app/delete-all",
              });
            }}
          >
            CLICK HERE
          </div>
        </Link>
      </div>
    </div>
  );
}
