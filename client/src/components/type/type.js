import React, { Component }  from 'react';
import AddSpecimen from './add-specimen';
import AddAttribution from './add-attribution';
import Specimens from '../specimens-list/specimens-list';
import { MapContainer, TileLayer  } from "react-leaflet";
import MapMarker from '../map/map-marker';

import InternalService from '../../services/internal-api';
import './type.css';

export default class Type extends Component {

  stampsData = new InternalService();

  state = {
    showType: null,
    typeAttributions: null,
    mode: ""
  };

  componentDidMount() {
    let searchParams = this.props.match.params;
    this.stampsData.getType([searchParams["o"],searchParams["r"]])
      .then((body) => {
        this.setState({
          showType: body.data,
        });
      });

      this.stampsData.getTypeAttributions([searchParams["o"]])
      .then((body) => {
        this.setState({
          typeAttributions: body.data,
        });
      });
  }

  renderAttributions(arr) {
    return arr.map(({id, name, name_en, datePower, dateDeath, year, publication, page, isTentative}) => {
      const uniqueKey = `${datePower}-${dateDeath}-${year}`;
      const dukeLink = `/person/${id}`;
      const tentativeAttribution = isTentative ? (<span className='circle'>!</span>) : null;
      return (
        <div key={uniqueKey}>
          <br /><b>Attributed to</b> {tentativeAttribution} <a href={dukeLink}>{name_en}</a> ({datePower} - {dateDeath}) <br />
          in <i>{year}</i> <span className="date">{publication}</span> С. {page}.
        </div>
      );
    });
  }

  canAdd(auth) {
    if (auth && this.state.mode==="")
      return (
        <button className="btn btn-secondary" title="Add another specimen"
          onClick={()=>{
            this.setState({
              mode: "addNewSpecimen"
            });
          }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus" viewBox="0 0 16 16">
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"></path>
          </svg>
        </button>
      )
  }

  canAddAttribution(auth) {
    if (auth && this.state.mode==="")
      return (
        <button className="btn btn-secondary" title="Add attribution"
          onClick={()=>{
            if (this.state.typeAttributions.length===0) {
              this.setState({
                mode: "addAttribution"
              });
            }
            else 
              if (window.confirm(`This type is already attributed to ${this.state.typeAttributions[0].name}. Are you sure you want to add an alternative attribution?`))
                {
                  this.setState({
                    mode: "addAttribution"
                  });
                }     
          }}>
          Attribute
        </button>
      )
  }

  completeAdd() {
    this.componentDidMount();
    this.setState({
      mode: ""
    });
  }

  render() {

    let { showType, typeAttributions, mode } = this.state;

    if (!showType || !typeAttributions || showType.length===0) {
      return (
        <h3>List of stamps is empty.</h3>
      )
    }

    showType = showType.slice().sort((a, b) => a.year - b.year);

    const addMore = this.canAdd(localStorage.getItem("token") ? true : false);
    const addAttribution = this.canAddAttribution(localStorage.getItem("token") ? true : false);

    const obvPath = `${this.stampsData._apiBase}/stamps/${showType[0].idObv}.${showType[0].obvType}`;
    const revPath = `${this.stampsData._apiBase}/stamps/${showType[0].idRev}.${showType[0].revType}`;

    const description = showType[0].obvDescription ? (
                <div>
                  <p><b>Obv</b>: {showType[0].obvDescription} </p>
                  <p><b>Rev</b>: {showType[0].revDescription} </p>
                </div>
              ) : null;

    const attribution = typeAttributions.length>0 ? this.renderAttributions(typeAttributions) : null;
    
    /// MAP DETAILS

    let north = -90; // Initial value for north extreme
    let south = 90;  // Initial value for south extreme
    let west = 180;  // Initial value for the westernmost extreme
    let east = -180; // Initial value for the easternmost extreme

    this.state.showType.forEach(point => {
      const { latitude, longitude } = point;
    
      if (latitude > north) {
        north = latitude;
      }
      if (latitude && latitude < south) {
        south = latitude;
      }
    
      if (longitude > east) {
        east = longitude;
      }
      if (longitude && longitude < west) {
        west = longitude;
      }
    });

    const centerLat = (north + south) / 2;
    const centerLng = (east + west) / 2;

    const bounds = [[south, west], [north, east]];

    const onlyFilledCoordinates = this.state.showType.filter((el) => el.longitude && el.latitude )

    const coordinates = onlyFilledCoordinates.map((el) => {
      const uniqueKey = `specimen_${el.id}`
      const markerFormat = {id: el.id, imgType: el.imgType, idObv: el.idObv, idRev: el.idRev,
         geo:el.geo, lat: el.latitude, lon: el.longitude, cnt: 2};
      return (<MapMarker key={uniqueKey} parameters={markerFormat} />)
    });

    const typeMap = onlyFilledCoordinates.length>0 ? 
      (              
      <MapContainer center={[centerLat, centerLng]} scrollWheelZoom={false} className='map-local'
      bounds={bounds} maxZoom={7}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {coordinates}
      </MapContainer>
      ): null;

    /// END of MAP DETAILS

    let codirect = null;
    if (showType[0].codirect!==null) {
      if (showType[0].codirect===1) codirect = (<div>↑↑</div>);
      else codirect = (<div>↑↓</div>);
    }

    // Right-side panel (specimens, or adding new data forms)
    let items, itemsHeader, panelClass;

    switch (mode) {
      case "addNewSpecimen":
        items = 
          (<AddSpecimen 
            onAdded={() => this.completeAdd()}
            defaultValues = {[showType[0].idObv, showType[0].idRev]} />);
  
        itemsHeader = 
          (<div><span className="greyish"><a
                onClick = {()=>this.setState({mode: ""})}
                title="Cancel">x</a></span>&nbsp;
                <div className="footer-widget-heading"><h3>Add a new specimen of the type</h3></div></div>);
    
        panelClass = "items-pad";
        break;
      case "addAttribution":
        items = 
          (<AddAttribution 
            onAdded={() => this.completeAdd()} 
            defaultValues = {[showType[0].idObv, showType[0].idRev]} />);
  
        itemsHeader = 
          (<div className="footer-widget-heading"><span className="greyish"><a
                onClick = {()=>this.setState({mode: ""})}
                title="Cancel">x</a></span>&nbsp;
                <h3>Add a new attribution</h3></div>);
    
        panelClass = "items-pad";
        break;
      default:
        items = (<Specimens onAdded={() => this.completeAdd()} items={showType} />);
  
        itemsHeader = (<div className="footer-widget-heading"><h3>Known specimens</h3></div>);
    
        panelClass = "items";
    }

    return (
      <div className="main-grid">
        <div className="stamp-overview">
            <p>
                <img src={obvPath} height="120" alt="Obverse" />
                <img src={revPath} height="120" alt="Reverse" />
                <br />
                {addMore}
            </p>
            {description}
            {codirect}
            {attribution}
            {addAttribution}
            {typeMap}
        </div>
        <div className='padding-both'>
          {itemsHeader}
          <div className={panelClass}>
            {items}
          </div>
        </div>
      </div>
    )
  }
}
