import React, { Component }  from 'react';
import { MapContainer, TileLayer, Popup, Marker  } from "react-leaflet";
import InternalService from '../../services/internal-api';
import MapMarker from './map-marker';

import './map.css';

export default class MapComponent extends Component {
  state = {
    geos: [],
    lat: 54.340083,
    lng: 29.7617912,
    zoom: 4
  };

  geoCoordinates = new InternalService();

  componentDidMount() {
    this.geoCoordinates.getLocations()
      .then((body) => {
        let allGeo = [];
        body.data.map(({geo, idObv, idRev, id, imgType}) => {
          this.geoCoordinates.getCoordinates(geo).then((geocode) => {
            allGeo.push({idObv, idRev, id, imgType, lat:geocode.data[0].lat, lon:geocode.data[0].lon});
          }).then(()=>this.setState({geos: allGeo}));
        });
      });
  };

  render() {
    var center = [this.state.lat, this.state.lng];

    const { geos } = this.state;
    const coordinates = geos.map((el) => {
      const uniqueKey = `spec_${el.id}`
      return (<MapMarker key={uniqueKey} parameters={el} />)
    });
    console.log(coordinates);

    return (
      <MapContainer center={[this.state.lat, this.state.lng]} zoom={this.state.zoom} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {coordinates}
      </MapContainer>
    );
  }
}
