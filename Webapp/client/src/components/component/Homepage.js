import React, { Component } from 'react';

class Homepage extends Component {
    render() {
        return (
            <div className="Grid">
                <p className="p1">
                    Hello, the person you are finding has just visited this place:<br />
                    <span className="bold italic"><button type="button" className="btn btn-primary">Click to take address</button> </span>
                </p>
                <p className="p2">
                    <span className="bold italic">Latitude:</span><br />
                    <span className="bold italic">Longitude:</span><br />
                    <span className="bold italic">Time:</span><br />
                </p>
                <map> <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.0925678826734!2d106.80281137580825!3d10.8805637572626!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174d8a5568c997f%3A0xdeac05f17a166e0c!2sHo%20Chi%20Minh%20city%20University%20of%20Technology!5e0!3m2!1sen!2s!4v1668149743095!5m2!1sen!2s" width={600} height={450} style={{border: 0}} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" /> </map>
                <p className="p3">Street View</p>
                <p className="p4">Location on Google Maps</p>
            </div>
        );
    }
}

export default Homepage;