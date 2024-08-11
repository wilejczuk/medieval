import React, { Component, createRef }  from 'react';
import { MapContainer, TileLayer, Polygon } from "react-leaflet";
import InternalService from '../../services/internal-api';
import MapMarker from './map-marker';

import './map.css';

export default class MapComponent extends Component {
  constructor(props) {
    super(props);
    this.mapRef = createRef();
  }

  state = {
    geos: [],
    districts: [],
    oblasts:[],
    lat: 54,
    lng: 30,
    zoom: 6
  };

  maxRegion = 0;
  maxOblast = 0;
  allOblasts = [];
  allDistricts = [];

  geoCoordinates = new InternalService();

  componentDidMount() {
    setTimeout(() => {
      const map = this.mapRef.current;
    }, 1000);
    this.geoCoordinates.getOblasts()
      .then((body) => {
        setTimeout(()=> {
          let boundaries = [];
          let area;
          this.allOblasts.map((el) => {
            const oblastName = el.geo.split(' ');
            if (oblastName.length > 1) {
              area = body.data.find(item => item.name_ru === oblastName[0]);
            }
            if (area) {
              if (el.cnt>this.maxOblast) this.maxOblast = el.cnt;
              boundaries.push({id: el.id, region: el.geo, boundary: area.boundaries, density: el.cnt});  
            }
            else console.log(el.geo + " " + el.cnt);
          });
          this.setState({oblasts: boundaries});

          boundaries = [];
          this.allDistricts.map((el) => {
            area = body.data.find(item => item.name_ru === el.geo.trim());
            if (area) {
              if(area.idParent==341) console.log(el.geo + " --------- " + el.cnt);

              if (el.cnt>this.maxRegion) this.maxRegion = el.cnt;
              boundaries.push({id: el.id, region: el.geo, boundary: area.boundaries, density: el.cnt});  
            }
            else console.log(el.geo + " " + el.cnt);
          });
          this.setState({districts: boundaries});

        }, 1000);
      });

    this.geoCoordinates.getLocations()
      .then((body) => {
        let allGeo = [];
        body.data.map(({geo, idObv, idRev, id, imgType, latitude, longitude, cnt}) => {
          if (latitude !== null && latitude !== null) {
            if (geo.includes("обл"))
              this.allOblasts.push({idObv, idRev, id, imgType, lat:latitude, lon:longitude, geo, cnt});
            else if (geo.includes("р-н")) 
              this.allDistricts.push({idObv, idRev, id, imgType, lat:latitude, lon:longitude, geo, cnt});
            else 
              allGeo.push({idObv, idRev, id, imgType, lat:latitude, lon:longitude, geo, cnt});
          }

          else {
            this.geoCoordinates.getCoordinates(geo).then(async(geocode) => {
              console.log(geo);
              if (geocode.data.length>0) {
                allGeo.push({idObv, idRev, id, imgType, lat:geocode.data[0].lat, lon:geocode.data[0].lon, geo, cnt});
                this.geoCoordinates.setCoordinates([id, geocode.data[0].lat, geocode.data[0].lon]);
              }
              else {
                this.geoCoordinates.setCoordinates([id, 0, 0]);
              }  
            });

          }
           
        });

        setTimeout(()=>{
          this.setState({geos: allGeo});
        }, 3000);

      });
  };

  renderSites(arr) {
    return arr.map(({id, cnt, geo, lat, lon}) => {
      const uniqueKey = `geo_${id}`;
      const href = `/location/${geo}`;
      const spanDynamicStyle = {
        width: cnt
      };
      return (
        <li key={uniqueKey}>
          <span className = "striped" style={spanDynamicStyle} width='200px'>&nbsp;</span> 
          &nbsp; <a href={href}>{geo} ({cnt})</a> 
          &nbsp; <a onClick={() => this.flyMap(lat, lon)}><img src="https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png" className="point-marker" /></a>
        </li>
      );
    });
  }

  flyMap = (lat,lon) => {
    this.mapRef.current.flyTo([lat,lon], 8);
  }

  render() {
    var center = [this.state.lat, this.state.lng];

    const { geos, districts, oblasts } = this.state;
    const sitesList = this.renderSites(geos.slice(0).reverse());
    const coordinates = geos.map((el) => {
      const uniqueKey = `spec_${el.id}`
      return (<MapMarker key={uniqueKey} parameters={el} />)
    });

    const rayons = districts.map((el) => {
      if (el.region === "Брянская обл") console.log(el.density);
      const uniqueKey = `dist_${el.id}`;
      let opacity = 0.2;
      if (el.density>50) opacity = 0.6;
      else if (el.density>10) opacity = 0.4;
      return (<Polygon 
        key={uniqueKey} 
        positions={JSON.parse(el.boundary)}
        pathOptions={{ fillOpacity: opacity, fillColor: 'green', stroke: false }}
      />)
    });

    const oblasti = oblasts.map((el) => {
      if (el.region === "Брянская обл") console.log(el.density);
      const uniqueKey = `obl_${el.id}`;
      let opacity = 0.2;
      if (el.density>100) opacity = 0.5;
      else if (el.density>50) opacity = 0.35;
      else if (el.density>10) opacity = 0.25;
      return (<Polygon 
        key={uniqueKey} 
        positions={JSON.parse(el.boundary)}
        pathOptions={{ fillOpacity: opacity, fillColor: 'green', stroke: false }}
      />)
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
          <MapContainer className='right-element'
           center={[this.state.lat, this.state.lng]} 
           zoom={this.state.zoom} 
           scrollWheelZoom={false}
           ref={this.mapRef}
           >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
            />
            {oblasti}
            {rayons}
            {coordinates}
          </MapContainer>
        </div>
      </div>
    );
  }
}