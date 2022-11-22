import Axios from 'axios';
import React, { Children, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ref = React.useRef(null);
const [map, setMap] = React.useState();
const [clicks, setClicks] = React.useState([]);
const [zoom, setZoom] = React.useState(3);
const [center, setCenter] = React.useState({
    lat: 0,
    lng: 0,
});

const onClick = (e) => {
    setClicks([...clicks, e.latLng]);
};

const onIdle = (m) => {
    console.log("onIlde");
    setZoom(m.getZoom());
    setCenter(m.getCenter().toJSON());
};

React.useEffect(() => {
  if (ref.current && !map) {
    setMap(new window.google.maps.Map(ref.current, {}));
  }
}, [ref, map]);

useDeepCompareEffectForMaps(() => {
    if (map) {
        map.setOptions(options);
    }
}, [map, options]);

React.useEffect(() => {
    if (map) {
        ["click", "idle"].forEach((eventName) => {
            google.maps.event.clearListeners(map, eventName);
        });
        if (onclick) {
            map.addListeners("click", onClick);
        }
        if (onIdle) {
            map.addListeners("idle", () => onIdle(map));
        }
    }
}, [map, onClick, onIdle]);

const Marker = (options) => {

    const [marker, setMarker] = React.useState();

    React.useEffect(() => {
        if (!marker) {
            setMarker(new google.maps.Marker());
        }
        return () => {
            if (marker) {
                marker.setMap(null);
            }
        };
    }, [marker]);

    React.useEffect(() => {
        if (marker) {
            marker.setOptions(options);
        }
    }, [marker, options]);
    return null;
};

return (
    <div ref={ref}>
        {React.Children.map(Children, (child) => {
            if (React.isValidElement(child)) {
                return React.cloneElement(child, {map});
            }
        })}
    </div>
);

export default index;