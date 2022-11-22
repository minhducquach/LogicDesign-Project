// import React, { useState } from 'react'
// import { withGoogleMap, withScriptjs, GoogleMap, InfoWindow, Marker } from "react-google-maps"
// import Geocode from "react-geocode";
// import { Autocomplete } from '@react-google-maps/api';
// import { componentDidMount } from '~/react-google-maps/lib/utils/MapChildHelper';
// import { Descriptions } from 'antd';

// const {MarkerWithLabel} = require("~/react-google-maps/lib/components/addons/MarkerWithLabel");

// Geocode.setApiKey("AIzaSyCqUXr3-dR8UpYt4IugKb80a989pwkYShE");
// Geocode.enableDebug();

// export default function Map() {

//   const [map, setMap] = useState({
//     address: "", city: "", area: "", state: "", time: "",
//     zoom: 60, height: 355,
//     mapPosition: {
//       lat: 0,
//       lng: 0,
//     },
//     markerPosition: {
//       lat: 0,
//       lng: 0,
//     }
//   });

//   let getCity = (addressArray) => {
//     let city = '';
//     for (let i = 0; i < addressArray.length; i++) {
//         if (addressArray[i].types[0] && 'administrative_area_level_2' === addressArray[i].types[0]) {
//             city = addressArray[i].long_name;
//             return city;
//         }
//     }
//   };

//   let getArea = (addressArray) => {
//     let area = '';
//     for (let i = 0; i < addressArray.length; i++) {
//         if (addressArray[i].types[0]) {
//             for (let j = 0; j < addressArray[i].types.length; j++) {
//                 if ('sublocality_level_1' === addressArray[i].types[j] || 'locality' === addressArray[i].types[j]) {
//                     area = addressArray[i].long_name;
//                     return area;
//                 }
//             }
//         }
//     }
//   };

//   let getState = (addressArray) => {
//     let state = '';
//     for (let i = 0; i < addressArray.length; i++) {
//         for (let i = 0; i < addressArray.length; i++) {
//             if (addressArray[i].types[0] && 'administrative_area_level_1' === addressArray[i].types[0]) {
//                 state = addressArray[i].long_name;
//                 return state;
//             }
//         }
//     }
//   };

//   let onChange = (event) => {
//     this.setState({ [event.target.name]: event.target.value });
//   };

//   let onInfoWindowClose = (event) => { };

//   let componentDidMount = () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(position => {
//         setMap(previousState => {
//           return {
//             ...previousState, 
//             mapPosition: {
//               lat: position.coords.latitude,
//               lng: position.coords.longitude,
//             },
//             markerPosition: {
//               lat: position.coords.latitude,
//               lng: position.coords.longitude,
//             }
//           }
//         },
//           () => {
//             Geocode.fromLatLng(position.coords.latitude, position.coords.longitude).then(
//               respone => {
//                 console.log(respone)
//                 const address = respone.result[0].formatted_address,
//                       addressArray = respone.result[0].address_components,
//                       city = getCity(addressArray),
//                       area = getArea(addressArray),
//                       state = getState(addressArray);
//                 console.log('city', city, area, state);
//                 setMap((previousState) => {
//                   return {
//                     ...previousState,
//                     address: (address) ? address : '',
//                     city: (city) ? city : '',
//                     area: (area) ? area : '',
//                     state: (state) ? state : '',
//                   }
//                 })   
//                 },
//                 error => {
//                   console.log(error);
//                 })
//               })
//           })
//       };
//   };

//   let onMarkerDragEnd = (event) => {
//     let newLat = event.latLng.lat(),
//         newLng = event.latLng.lng();

//     Geocode.fromLatLng(newLat, newLng).then(
//         response => {
//             const address = response.results[0].formatted_address,
//                 addressArray = response.results[0].address_components,
//                 city = this.getCity(addressArray),
//                 area = this.getArea(addressArray),
//                 state = this.getState(addressArray);
//             setMap(() => {
//               return {
//                 address: (address) ? address : '',
//                 area: (area) ? area : '',
//                 city: (city) ? city : '',
//                 state: (state) ? state : '',
//                 markerPosition: {
//                     lat: newLat,
//                     lng: newLng
//                 },
//                 mapPosition: {
//                     lat: newLat,
//                     lng: newLng
//                 }
//               }
//             })
//         },
//         error => {
//             console.error(error);
//         }
//     );
// };

// let onPlaceSelected = (place) => {
//     console.log('plc', place);
//     const address = place.formatted_address,
//         addressArray = place.address_components,
//         city = this.getCity(addressArray),
//         area = this.getArea(addressArray),
//         state = this.getState(addressArray),
//         latValue = place.geometry.location.lat(),
//         lngValue = place.geometry.location.lng();

//     console.log('latvalue', latValue)
//     console.log('lngValue', lngValue)

//     // Set these values in the state.
//     setMap( () => {
//       return {
//         address: (address) ? address : '',
//         area: (area) ? area : '',
//         city: (city) ? city : '',
//         state: (state) ? state : '',
//         markerPosition: {
//             lat: latValue,
//             lng: lngValue
//         },
//         mapPosition: {
//             lat: latValue,
//             lng: lngValue
//         },
//       }
//     })
//   };

//   const AsyncMap = withScriptjs(

//     withGoogleMap(
//         props => (
//             <GoogleMap
//                 defaultZoom={map.zoom}
//                 defaultCenter={{ 
//                   lat: map.mapPosition.lat, 
//                   lng: map.mapPosition.lng 
//                 }}>
//                 <Marker
//                     google={props.google}
//                     name={'Dolores park'}
//                     draggable={true}
//                     onDragEnd={onMarkerDragEnd()}
//                     position={{ 
//                       lat: map.markerPosition.lat, 
//                       lng: map.markerPosition.lng 
//                     }} />
//                 <InfoWindow
//                     onClose={onInfoWindowClose()}
//                     position={{ lat: (map.markerPosition.lat + 0.0018), 
//                       lng: map.markerPosition.lng 
//                     }} >
//                     <div>
//                         <span style={{ padding: 0, margin: 0 }}>
//                           {map.address}
//                         </span>
//                     </div>
//                 </InfoWindow>
//                 <Marker />
//                 <Autocomplete
//                     style={{
//                         width: '100%',
//                         height: '40px',
//                         paddingLeft: '16px',
//                         marginTop: '2px',
//                         marginBottom: '2rem'
//                     }}
//                     onPlaceSelected={onPlaceSelected()}
//                     types={['(regions)']}
//                 />
//             </GoogleMap>
//         )
//     )
//   );

//   return (
//     <div style={{ padding: '1rem', margin: '0 auto', maxWidth: 1000 }}>
//       <h1>Google Map Basic</h1>
//       <Descriptions bordered>
//         <Descriptions.Item label="City">{map.city}</Descriptions.Item>
//         <Descriptions.Item label="Area">{map.area}</Descriptions.Item>
//         <Descriptions.Item label="State">{map.state}</Descriptions.Item>
//         <Descriptions.Item label="Address">{map.address}</Descriptions.Item>
//       </Descriptions>

//       <AsyncMap
//         googleMapURL = "https://maps.googleapis.com/maps/api/js?key=AIzaSyCqUXr3-dR8UpYt4IugKb80a989pwkYShE&libraries=places"
//         loadingElement = {
//           <div style = {{ height: `100%` }} /> 
//         }
//         containerElement = {
//           <div style={{ height: this.state.height }} />
//         }
//         mapElement = {
//           <div style={{ height: `100%` }} />
//         }
//       />
//     </div>
//   ) 
  
// };


// // class LocationSearchModal extends React.Component {

// //   state = {
// //       address: '',
// //       city: '',
// //       area: '',
// //       state: '',
// //       zoom: 60,
// //       height: 355,
// //       mapPosition: {
// //           lat: 0,
// //           lng: 0,
// //       },
// //       markerPosition: {
// //           lat: 0,
// //           lng: 0,
// //       }
// //   }

//   // componentDidMount() {
//   //     if (navigator.geolocation) {
//   //         navigator.geolocation.getCurrentPosition(position => {
//   //             this.setState({
//   //                 mapPosition: {
//   //                     lat: position.coords.latitude,
//   //                     lng: position.coords.longitude,
//   //                 },
//   //                 markerPosition: {
//   //                     lat: position.coords.latitude,
//   //                     lng: position.coords.longitude,
//   //                 }
//   //             },
// //                   () => {
// //                       Geocode.fromLatLng(position.coords.latitude, position.coords.longitude).then(
// //                           response => {
// //                               console.log(response)
// //                               const address = response.results[0].formatted_address,
// //                                   addressArray = response.results[0].address_components,
// //                                   city = this.getCity(addressArray),
// //                                   area = this.getArea(addressArray),
// //                                   state = this.getState(addressArray);
// //                               console.log('city', city, area, state);
// //                               this.setState({
// //                                   address: (address) ? address : '',
// //                                   area: (area) ? area : '',
// //                                   city: (city) ? city : '',
// //                                   state: (state) ? state : '',
// //                               })
// //                           },
// //                           error => {
// //                               console.error(error);
// //                           }
// //                       );

// //                   })
// //           });
// //       } else {
// //           console.error("Geolocation is not supported by this browser!");
// //       }
// //   };

// //   // shouldComponentUpdate(nextProps, nextState, nextContext) {
// //   //     if (
// //   //         this.state.markerPosition.lat !== this.state.center.lat ||
// //   //         this.state.address !== nextState.address ||
// //   //         this.state.city !== nextState.city ||
// //   //         this.state.area !== nextState.area ||
// //   //         this.state.state !== nextState.state
// //   //     ) {
// //   //         return true
// //   //     } else if (this.state.mapPosition.lat === nextState.mapPosition.lat) {
// //   //         return false
// //   //     }
// //   // }

// //   getCity = (addressArray) => {
// //       let city = '';
// //       for (let i = 0; i < addressArray.length; i++) {
// //           if (addressArray[i].types[0] && 'administrative_area_level_2' === addressArray[i].types[0]) {
// //               city = addressArray[i].long_name;
// //               return city;
// //           }
// //       }
// //   };

// //   getArea = (addressArray) => {
// //       let area = '';
// //       for (let i = 0; i < addressArray.length; i++) {
// //           if (addressArray[i].types[0]) {
// //               for (let j = 0; j < addressArray[i].types.length; j++) {
// //                   if ('sublocality_level_1' === addressArray[i].types[j] || 'locality' === addressArray[i].types[j]) {
// //                       area = addressArray[i].long_name;
// //                       return area;
// //                   }
// //               }
// //           }
// //       }
// //   };

// //   getState = (addressArray) => {
// //       let state = '';
// //       for (let i = 0; i < addressArray.length; i++) {
// //           for (let i = 0; i < addressArray.length; i++) {
// //               if (addressArray[i].types[0] && 'administrative_area_level_1' === addressArray[i].types[0]) {
// //                   state = addressArray[i].long_name;
// //                   return state;
// //               }
// //           }
// //       }
// //   };

// //   onChange = (event) => {
// //       this.setState({ [event.target.name]: event.target.value });
// //   };

// //   onInfoWindowClose = (event) => { };

// //   onMarkerDragEnd = (event) => {
// //       let newLat = event.latLng.lat(),
// //           newLng = event.latLng.lng();

// //       Geocode.fromLatLng(newLat, newLng).then(
// //           response => {
// //               const address = response.results[0].formatted_address,
// //                   addressArray = response.results[0].address_components,
// //                   city = this.getCity(addressArray),
// //                   area = this.getArea(addressArray),
// //                   state = this.getState(addressArray);
// //               this.setState({
// //                   address: (address) ? address : '',
// //                   area: (area) ? area : '',
// //                   city: (city) ? city : '',
// //                   state: (state) ? state : '',
// //                   markerPosition: {
// //                       lat: newLat,
// //                       lng: newLng
// //                   },
// //                   mapPosition: {
// //                       lat: newLat,
// //                       lng: newLng
// //                   },
// //               })
// //           },
// //           error => {
// //               console.error(error);
// //           }
// //       );
// //   };

// //   onPlaceSelected = (place) => {
// //       console.log('plc', place);
// //       const address = place.formatted_address,
// //           addressArray = place.address_components,
// //           city = this.getCity(addressArray),
// //           area = this.getArea(addressArray),
// //           state = this.getState(addressArray),
// //           latValue = place.geometry.location.lat(),
// //           lngValue = place.geometry.location.lng();

// //       console.log('latvalue', latValue)
// //       console.log('lngValue', lngValue)

// //       // Set these values in the state.
// //       this.setState({
// //           address: (address) ? address : '',
// //           area: (area) ? area : '',
// //           city: (city) ? city : '',
// //           state: (state) ? state : '',
// //           markerPosition: {
// //               lat: latValue,
// //               lng: lngValue
// //           },
// //           mapPosition: {
// //               lat: latValue,
// //               lng: lngValue
// //           },
// //       })
// //   };

// //   // const AsyncMap = compose(
// //   //     withProps({
// //   //         googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyALVjLwOIM1gf7EzdJJVmWLKdLP-yZGTcw&v=3.exp&libraries=geometry,drawing,places",
// //   //         loadingElement: <div style={{ height: `100%` }} />,
// //   //         containerElement: <div style={{ height: `400px` }} />,
// //   //         mapElement: <div style={{ height: `100%` }} />,
// //   //     }),
// //   //     withScriptjs,
// //   //     withGoogleMap
// //   // )((props) =>
// //   //     <GoogleMap

// //   render() {
// //       const AsyncMap = withScriptjs(
// //           withGoogleMap(
// //               props => (
// //                   <GoogleMap
// //                       defaultZoom={this.state.zoom}
// //                       defaultCenter={{ lat: this.state.mapPosition.lat, lng: this.state.mapPosition.lng }}
// //                   >
// //                       {/* InfoWindow on top of marker */}

// //                       {/*Marker*/}
// //                       <Marker
// //                           google={this.props.google}
// //                           name={'Dolores park'}
// //                           draggable={true}
// //                           onDragEnd={this.onMarkerDragEnd}
// //                           position={{ lat: this.state.markerPosition.lat, lng: this.state.markerPosition.lng }}
// //                       />
// //                       <InfoWindow
// //                           onClose={this.onInfoWindowClose}
// //                           position={{ lat: (this.state.markerPosition.lat + 0.0018), lng: this.state.markerPosition.lng }}
// //                       >
// //                           <div>
// //                               <span style={{ padding: 0, margin: 0 }}>{this.state.address}</span>
// //                           </div>
// //                       </InfoWindow>
// //                       <Marker />

// //                       {/* <MarkerWithLabel
// //                           position={{ lat: -34.397, lng: 150.644 }}
// //                           labelAnchor={new google.maps.Point(0, 0)}
// //                           labelStyle={{ backgroundColor: "yellow", fontSize: "32px", padding: "16px" }}
// //                       >
// //                           <div>Hello There!</div>
// //                       </MarkerWithLabel> */}


// //                       {/* For Auto complete Search Box */}
// //                       <Autocomplete
// //                           style={{
// //                               width: '100%',
// //                               height: '40px',
// //                               paddingLeft: '16px',
// //                               marginTop: '2px',
// //                               marginBottom: '2rem'
// //                           }}
// //                           onPlaceSelected={this.onPlaceSelected}
// //                           types={['(regions)']}
// //                       />
// //                   </GoogleMap>
// //               )
// //           )
// //       );

// //       return (
// //           <div style={{ padding: '1rem', margin: '0 auto', maxWidth: 1000 }}>
// //               <h1>Google Map Basic</h1>
// //               <Descriptions bordered>
// //                   <Descriptions.Item label="City">{this.state.city}</Descriptions.Item>
// //                   <Descriptions.Item label="Area">{this.state.area}</Descriptions.Item>
// //                   <Descriptions.Item label="State">{this.state.state}</Descriptions.Item>
// //                   <Descriptions.Item label="Address">{this.state.address}</Descriptions.Item>
// //               </Descriptions>

// //               <AsyncMap
// //                   googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyALVjLwOIM1gf7EzdJJVmWLKdLP-yZGTcw&libraries=places"
// //                   loadingElement={
// //                       <div style={{ height: `100%` }} />
// //                   }
// //                   containerElement={
// //                       <div style={{ height: this.state.height }} />
// //                   }
// //                   mapElement={
// //                       <div style={{ height: `100%` }} />
// //                   }
// //               />
// //           </div>
// //       )
// //   }

// // }

// // const Map = () => {
// //   return (
// //     <div>
// //       <GoogleMap
// //           defaultZoom={8}
// //           defaultCenter={{ lat: -34.397, lng: 150.644 }}
// //         >
// //       </GoogleMap>
// //     </div>
// //   );
// // }

// // export default LocationSearchModal;

