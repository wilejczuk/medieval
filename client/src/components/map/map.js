import React, { Component }  from 'react';
import { MapContainer, TileLayer  } from "react-leaflet";
import InternalService from '../../services/internal-api';
import MapMarker from './map-marker';

import './map.css';

export default class MapComponent extends Component {
  state = {
    geos: [],
    lat: 54,
    lng: 30,
    zoom: 6
  };

  geoCoordinates = new InternalService();

  componentDidMount() {
    this.geoCoordinates.getLocations()
      .then((body) => {
        let allGeo = [];
        body.data.map(({geo, idObv, idRev, id, imgType, latitude, longitude, cnt}) => {
          if (latitude) allGeo.push({idObv, idRev, id, imgType, lat:latitude, lon:longitude, geo, cnt});
          else {
            this.geoCoordinates.getCoordinates(geo).then((geocode) => {
              if (geocode.data.length>0) {
                allGeo.push({idObv, idRev, id, imgType, lat:geocode.data[0].lat, lon:geocode.data[0].lon, geo, cnt});
                this.geoCoordinates.setCoordinates([id, geocode.data[0].lat, geocode.data[0].lon]);
              }
            });
          }
        });
        this.setState({geos: allGeo});
      });
  };

  renderSites(arr) {
    
    return arr.map(({id, cnt, geo}) => {
      const uniqueKey = `geo_${id}`;
      const href = `/location/${geo}`;
      const spanDynamicStyle = {
        width: cnt
      };

      return (
        <li key={uniqueKey}>
          <span className = "striped" style={spanDynamicStyle} wdith='200px'>&nbsp;</span> 
          &nbsp; <a href={href}>{geo} ({cnt})</a>
        </li>
      );
    });
  }

  render() {
    var center = [this.state.lat, this.state.lng];

    const { geos } = this.state;
    const sitesList = this.renderSites(geos.slice(0).reverse());
    const coordinates = geos.map((el) => {
      const uniqueKey = `spec_${el.id}`
      return (<MapMarker key={uniqueKey} parameters={el} />)
    });
    
    return (
      <div className='map-stats'>
        <div className='footer-widget-heading padding-both left-element'> 
          <h3>By find area</h3>
          <ul className='nodot'> 
            {sitesList}
          </ul> 
        </div>
        <div >
          <MapContainer className='right-element' center={[this.state.lat, this.state.lng]} zoom={this.state.zoom} scrollWheelZoom={false}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {coordinates}
          </MapContainer>
        </div>
      </div>
    );
  }
}