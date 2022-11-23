import React, { Component } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import Homepage from './Homepage';

export default function Intial () {
    return (
        <div>
            <div className="body">
                <div className="content-1">Hello, your relative's position doesn't show on our WebSite</div>
                <div className="content-2">Please click here to know!</div>
                <Link to = "/homepage" id='none'>
                    <div className='click'>
                        CLICK HERE
                    </div>
                </Link>
            </div> 
        </div>
    );
}