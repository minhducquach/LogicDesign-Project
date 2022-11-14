//import axios from 'axios';
import React, { Component } from 'react';

// state = {
//     listUser: []
// }

Data.get("/get-entries", (req, res) => console.log(res));

class Data extends Component {
    // componentDidMount() {
    //     let res = axios.get('http://127.0.0.1:5001/logicdesign-project/us-central1/app/get-entries')
    //     .then (() => {
    //         console.log(res);
    //     }) 
    //     // this.setState({
    //     //     listUser: res && res.data && res.data.data ? res.data.data : []
    //     // })
    // }

    render() {
        // let {listUser} = this.state;
        return (
            <div className='list-user'>
                {/* {
                    listUser && listUser.length > 0 &&
                    listUser.map((item, index) => {
                        return (
                            <div className='data' key = {item.key}>
                                {index + 1} - {item.data}
                            </div>
                        )
                    })
                }   */}
            </div>
        );
    }
}

export default Data;