import React, { Component }  from 'react';
import { Popup, Marker } from "react-leaflet";
import './map-marker.css';

export default class MapMarker extends Component {

  render() {

    const {idObv, idRev, lat, lon} = this.props.parameters;

    return (
      <Marker position={[{lat}, {lon}]}>
        <Popup>
          Obv: {idObv} <br /> Rev: {idRev}
        </Popup>
      </Marker>
    )
  }
}
