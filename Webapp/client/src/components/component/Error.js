import React, { Component } from 'react';
import { connect } from 'react-redux';

class Error extends Component {
    render() {
        return (
            <div className = "body-error">
                <div className = "content-1-error">error 404</div>
                <div className = "content-2-error">page not found, please go back</div>
            </div>
        );
    }
}

export default Error;