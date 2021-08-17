import React from "react";
import {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
    Marker
} from "react-google-maps";

class MapTest extends React.Component {
    constructor() {
        super();
        this.state = {
            markerPosition: { lat: 0, long: 0 }
        };
    }


    Map = withScriptjs(
        withGoogleMap((props) => (
            <GoogleMap
                defaultZoom={15}
                defaultCenter={{ lat: props.lat, lng: props.lng }}
                defaultOptions={{
                    scrollwheel: false,
                    disableDefaultUI: true
                }}
            >
                {props.children}
            </GoogleMap>
        ))
    );
    render() {
        return (
            <this.Map {...this.props} >
                <Marker
                    position={{
                        lat: this.props.lat,
                        lng: this.props.lng
                    }}
                    title="Abrir en Google Maps"
                    onClick={() => {

                        window.open(`https://www.google.com.ar/maps/dir/${this.props.lat},${this.props.lng}//@${this.props.lat},${this.props.lng},16.5z`, "_blank")
                    }}
                >
                </Marker>
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