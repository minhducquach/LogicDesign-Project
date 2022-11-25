import React from 'react';
import { Link } from 'react-router-dom';

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