import React, { Component }  from 'react';
import { useNavigate } from "react-router-dom";
import { Popup, Marker, Circle, Tooltip } from "react-leaflet";
import L from "leaflet";
import InternalService from '../../../services/internal-api';
import './map-marker.css';

export default class MapMarker extends Component {
  stampsData = new InternalService();

  numberedIcon = L.Icon.extend({
    options: {
      number: '',
      shadowUrl: null,
      iconAnchor: new L.Point(13, 41),
      popupAnchor: new L.Point(0, -33),
      className: 'leaflet-div-icon'
    },
  
    createIcon: function () {
      var div = document.createElement('div');
      var numdiv = document.createElement('div');
      numdiv.setAttribute ( "class", "number" );
      numdiv.innerHTML = this.options['number'] || '';
      div.appendChild ( numdiv );
      this._setIconStyles(div, 'icon');
      return div;
    },
  
    createShadow: function () {
      return null;
    }
  });

  render() {
    const {id, imgType, idObv, idRev, geo, lat, lon, cnt} = this.props.parameters;
    const path = `${this.stampsData._apiBase}specimens/${id}.${imgType}`;
    const link = `/location/${geo}`;

    const icon = new this.numberedIcon({number: cnt < 15 ? '•' : cnt});

    const radius = 
      cnt===1 ? 2500 :
        cnt<10 ? 5000 : 
          cnt<20 ? 7500 :
            cnt<50 ? 12000 : 15000;
    
    const fill = 
      cnt===1 ? 'red' :
        cnt<10 ? 'yellow' : 
          cnt<20 ? '#3333FF' : 
            cnt<50 ? 'orange' : '#800000';

    return (
      <Marker position={[lat, lon]} icon={icon} eventHandlers={{
        click: (e) => {
          window.location.href = `/location/${geo}`
        },
      }} >
        <Tooltip>
          {geo}
        </Tooltip>    
        <Circle eventHandlers={{
                  click: (e) => {
                    window.location.href = `/location/${geo}`
                  },
                }}
                center={{lat:lat, lng: lon}}
                fillColor='green' 
                color='grey'
                weight={0.5}
                fillOpacity= '0.8'
                radius={radius}
                 />
    
      </Marker>
    )
  }
}
