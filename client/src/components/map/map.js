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
        //console.log(body.data);
        let allGeo = [];
        body.data.map(({geo, idObv, idRev}) => {
          this.geoCoordinates.getCoordinates(geo).then((geocode) => {
            allGeo.push({idObv, idRev, lat:geocode.data[0].lat, lon:geocode.data[0].lon});
            //console.log(geocode.data);
          });
        });
        this.setState({
          geos: allGeo,
        });
      });
  }

  render() {
    var center = [this.state.lat, this.state.lng];

    const { geos } = this.state;
    console.log(geos);
    const coordinates = geos.map(() => (<MapMarker parameters={geos} />));
    console.log(coordinates);

    return (
      <MapContainer center={[this.state.lat, this.state.lng]} zoom={this.state.zoom} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {coordinates}
        <Marker position={[55.1930197, 30.2070437]}>
          <Popup>
            <a href="/type/7/8">Печать Федор Тирон / Михаил Архангел</a>
          </Popup>
        </Marker>
        <Marker position={[54.340083, 29.7617912]}>
          <Popup>
            <a href="/type/5/6">Печать Михаил Архангел / Богоматерь Оранта</a>
          </Popup>
        </Marker>
      </MapContainer>
    );
  }
}
