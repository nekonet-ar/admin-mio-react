import React from "react";
import {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
    Marker,
    Circle,
    InfoWindow
} from "react-google-maps";

class MapTest extends React.Component {
    constructor() {
        super();
        this.state = {
            isMarkerShown: false,
            markerPosition: null,
            cantVisit: 3000,
            ciudad: "",
            idClick: 0
        };
    }
    onClickCircle = (cant, lat, long, ciudad, id) =>
        this.setState({
            isMarkerShown: true,
            markerPosition: { lat: lat, long: long },
            cantVisit: cant,
            ciudad: ciudad,
            idClick: id
        });
    onCloseInfo = () => {
        this.setState({
            isMarkerShown: false
        })
    }

    Map = withScriptjs(
        withGoogleMap((props) => (
            <GoogleMap
                defaultZoom={5}
                defaultCenter={{ lat: -40.399289, lng: -64.1642636 }}
                onClick={props.onClick}
                defaultOptions={{
                    scrollwheel: false,
                    disableDefaultUI: true,
                    styles:
                        [
                            {
                                "elementType": "geometry",
                                "stylers": [
                                    {
                                        "color": "#1d2c4d"
                                    }
                                ]
                            },
                            {
                                "elementType": "labels.text.fill",
                                "stylers": [
                                    {
                                        "color": "#8ec3b9"
                                    }
                                ]
                            },
                            {
                                "elementType": "labels.text.stroke",
                                "stylers": [
                                    {
                                        "color": "#1a3646"
                                    }
                                ]
                            },
                            {
                                "featureType": "administrative",
                                "elementType": "labels",
                                "stylers": [
                                    {
                                        "visibility": "off"
                                    }
                                ]
                            },
                            {
                                "featureType": "administrative.country",
                                "elementType": "geometry.stroke",
                                "stylers": [
                                    {
                                        "color": "#4b6878"
                                    },
                                    {
                                        "weight": 3
                                    }
                                ]
                            },
                            {
                                "featureType": "administrative.country",
                                "elementType": "labels.text",
                                "stylers": [
                                    {
                                        "visibility": "off"
                                    }
                                ]
                            },
                            {
                                "featureType": "administrative.land_parcel",
                                "stylers": [
                                    {
                                        "visibility": "off"
                                    }
                                ]
                            },
                            {
                                "featureType": "administrative.land_parcel",
                                "elementType": "labels.text.fill",
                                "stylers": [
                                    {
                                        "color": "#64779e"
                                    }
                                ]
                            },
                            {
                                "featureType": "administrative.locality",
                                "elementType": "labels.text",
                                "stylers": [
                                    {
                                        "visibility": "off"
                                    }
                                ]
                            },
                            {
                                "featureType": "administrative.province",
                                "elementType": "geometry.stroke",
                                "stylers": [
                                    {
                                        "color": "#4b6878"
                                    },
                                    {
                                        "weight": 3
                                    }
                                ]
                            },
                            {
                                "featureType": "administrative.province",
                                "elementType": "labels.text",
                                "stylers": [
                                    {
                                        "visibility": "off"
                                    }
                                ]
                            },
                            {
                                "featureType": "landscape",
                                "elementType": "labels",
                                "stylers": [
                                    {
                                        "visibility": "off"
                                    }
                                ]
                            },
                            {
                                "featureType": "landscape.man_made",
                                "elementType": "geometry.stroke",
                                "stylers": [
                                    {
                                        "color": "#334e87"
                                    },
                                    {
                                        "weight": 8
                                    }
                                ]
                            },
                            {
                                "featureType": "landscape.natural",
                                "elementType": "geometry",
                                "stylers": [
                                    {
                                        "color": "#023e58"
                                    }
                                ]
                            },
                            {
                                "featureType": "poi",
                                "stylers": [
                                    {
                                        "visibility": "off"
                                    }
                                ]
                            },
                            {
                                "featureType": "poi",
                                "elementType": "geometry",
                                "stylers": [
                                    {
                                        "color": "#283d6a"
                                    }
                                ]
                            },
                            {
                                "featureType": "poi",
                                "elementType": "labels",
                                "stylers": [
                                    {
                                        "visibility": "off"
                                    }
                                ]
                            },
                            {
                                "featureType": "poi",
                                "elementType": "labels.text",
                                "stylers": [
                                    {
                                        "visibility": "off"
                                    }
                                ]
                            },
                            {
                                "featureType": "poi",
                                "elementType": "labels.text.fill",
                                "stylers": [
                                    {
                                        "color": "#6f9ba5"
                                    }
                                ]
                            },
                            {
                                "featureType": "poi",
                                "elementType": "labels.text.stroke",
                                "stylers": [
                                    {
                                        "color": "#1d2c4d"
                                    }
                                ]
                            },
                            {
                                "featureType": "poi.park",
                                "elementType": "geometry.fill",
                                "stylers": [
                                    {
                                        "color": "#023e58"
                                    }
                                ]
                            },
                            {
                                "featureType": "poi.park",
                                "elementType": "labels.text.fill",
                                "stylers": [
                                    {
                                        "color": "#3C7680"
                                    }
                                ]
                            },
                            {
                                "featureType": "road",
                                "stylers": [
                                    {
                                        "visibility": "off"
                                    }
                                ]
                            },
                            {
                                "featureType": "road",
                                "elementType": "geometry",
                                "stylers": [
                                    {
                                        "color": "#304a7d"
                                    }
                                ]
                            },
                            {
                                "featureType": "road",
                                "elementType": "labels",
                                "stylers": [
                                    {
                                        "visibility": "off"
                                    }
                                ]
                            },
                            {
                                "featureType": "road",
                                "elementType": "labels.text.fill",
                                "stylers": [
                                    {
                                        "color": "#98a5be"
                                    }
                                ]
                            },
                            {
                                "featureType": "road",
                                "elementType": "labels.text.stroke",
                                "stylers": [
                                    {
                                        "color": "#1d2c4d"
                                    }
                                ]
                            },
                            {
                                "featureType": "road.highway",
                                "elementType": "geometry",
                                "stylers": [
                                    {
                                        "color": "#2c6675"
                                    }
                                ]
                            },
                            {
                                "featureType": "road.highway",
                                "elementType": "geometry.stroke",
                                "stylers": [
                                    {
                                        "color": "#255763"
                                    }
                                ]
                            },
                            {
                                "featureType": "road.highway",
                                "elementType": "labels.text.fill",
                                "stylers": [
                                    {
                                        "color": "#b0d5ce"
                                    }
                                ]
                            },
                            {
                                "featureType": "road.highway",
                                "elementType": "labels.text.stroke",
                                "stylers": [
                                    {
                                        "color": "#023e58"
                                    }
                                ]
                            },
                            {
                                "featureType": "transit",
                                "stylers": [
                                    {
                                        "visibility": "off"
                                    }
                                ]
                            },
                            {
                                "featureType": "transit",
                                "elementType": "labels.text.fill",
                                "stylers": [
                                    {
                                        "color": "#98a5be"
                                    }
                                ]
                            },
                            {
                                "featureType": "transit",
                                "elementType": "labels.text.stroke",
                                "stylers": [
                                    {
                                        "color": "#1d2c4d"
                                    }
                                ]
                            },
                            {
                                "featureType": "transit.line",
                                "elementType": "geometry.fill",
                                "stylers": [
                                    {
                                        "color": "#283d6a"
                                    }
                                ]
                            },
                            {
                                "featureType": "transit.station",
                                "elementType": "geometry",
                                "stylers": [
                                    {
                                        "color": "#3a4762"
                                    }
                                ]
                            },
                            {
                                "featureType": "water",
                                "elementType": "geometry",
                                "stylers": [
                                    {
                                        "color": "#0e1626"
                                    }
                                ]
                            },
                            {
                                "featureType": "water",
                                "elementType": "labels.text.fill",
                                "stylers": [
                                    {
                                        "color": "#4e6d70"
                                    }
                                ]
                            }
                        ]
                }}
            >
                {props.children}
            </GoogleMap>
        ))
    );
    render() {
        return (
            <this.Map {...this.props} >

                {this.props.visitArray.map((item, key) => {

                    return (
                        <>
                            <Marker
                                position={{ lat: (item.center.lat - 1), lng: item.center.lng }}
                                defaultOpacity={0}
                                onClick={() => this.onClickCircle(item.visitas, item.center.lat, item.center.lng, item.ciudad, key)}
                            >
                                {this.state.isMarkerShown ?
                                    key === this.state.idClick ?
                                        <InfoWindow
                                            onCloseClick={this.onCloseInfo}>
                                            <>
                                                <h3>{this.state.ciudad}</h3>
                                                <h4>Cantidad de {this.props.tipoRes}:</h4>
                                                <h5>{this.state.cantVisit}</h5>
                                            </>
                                        </InfoWindow> : null : null}
                            </Marker>
                            <Circle
                                defaultCenter={{
                                    lat: item.center.lat,
                                    lng: item.center.lng
                                }}
                                radius={
                                    (70000 / this.props.visitArray[0].visitas) * item.visitas
                                }
                                options={{
                                    strokeColor: "cyan",
                                    strokeOpacity: 0.8,
                                    strokeWeight: 2,
                                    fillColor: "cyan",
                                    fillOpacity: 0.5
                                }}
                                onClick={() => this.onClickCircle(item.visitas, item.center.lat, item.center.lng, item.ciudad, key)}
                            >
                            </Circle>
                        </>
                    )
                })
                }


            </this.Map>
        );
    }
}

class MapVisit extends React.Component {
    render() {
        return (
            <MapTest
                {...this.props}
                googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCZ7FEfbxRP0S2s0aUGCS3AEIp87EnlIl4"
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={
                    <div
                        style={{ height: `100%` }}
                        className="map-canvas"
                        id="map-canvas"
                    />
                }
                mapElement={
                    <div style={{ height: '100%', borderRadius: "inherit" }} />
                }
            />
        );
    }
}

export default MapVisit