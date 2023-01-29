import React, { Component }  from 'react';
import { Popup, Marker } from "react-leaflet";
import InternalService from '../../../services/internal-api';
import './map-marker.css';

export default class MapMarker extends Component {
  stampsData = new InternalService();

  render() {
    const {id, imgType, idObv, idRev, lat, lon} = this.props.parameters;
    const path = `${this.stampsData._apiBase}specimens/${id}.${imgType}`;
    const link = `/type/${idObv}/${idRev}`;

    return (
      <Marker position={[lat, lon]}>
        <Popup>
          <a href={link}>
            <img src={path} width="100" alt="Specimen" />
          </a>
        </Popup>
      </Marker>
    )
  }
}
