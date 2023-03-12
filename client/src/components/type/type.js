import React, { Component }  from 'react';
import References from './references';
import AddSpecimen from './add-specimen';
import AddAttribution from './add-attribution';

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
       
        console.log(body.data);
                this.setState({
          typeAttributions: body.data,
        });
      });
  }

  renderItems(arr) {
    let existingSpecimens = [];
    let unpackedReferences = [];
    arr.map(({id, imgType, name, year, page, number, geo, weight, maxDiameter}) => {
      if (existingSpecimens.indexOf(id) === -1) {
        existingSpecimens.push(id);
        unpackedReferences.push({id, imgType, geo, weight, maxDiameter, refs: [{name, year, page, number}]});
      } else {
        unpackedReferences.find(o => o.id === id)['refs'].push({name, year, page, number});
      }
    });

    return unpackedReferences.map(({id, imgType, refs, geo, weight, maxDiameter}) => {
        const path = `${this.stampsData._apiBase}specimens/${id}.${imgType}`;
        const uniqueKey = `specimen${id}`;
        let params = '';
        if (geo) params = `${geo}. `;
        if (weight) params += `Weight: ${weight} g. `;
        if (maxDiameter) params += `Diameter: ${maxDiameter} mm`;

        return (
          <div key={uniqueKey} className="items-pad">
            <img src={path} height="150" alt="Specimen" />
            <div className="paddington">
              {params}
            </div>
            <References refs={refs}/>
          </div>
        );
    });
  }

  renderAttributions(arr) {
    return arr.map(({name, datePower, dateDeath, year, publication, page}) => {
      const uniqueKey = `${datePower}-${dateDeath}-${year}`;
      return (
        <div key={uniqueKey}>
          <br /><b>Attributed to</b> {name} ({datePower} - {dateDeath}) <br />
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

    const { showType, typeAttributions, mode } = this.state;

    if (!showType || !typeAttributions) {
      return (
        <h3>List of stamps is empty.</h3>
      )
    }

    const addMore = this.canAdd(localStorage.getItem("token") ? true : false);
    const addAttribution = this.canAddAttribution(localStorage.getItem("token") ? true : false);
    console.log (showType);
    const obvPath = `${this.stampsData._apiBase}/stamps/${showType[0].idObv}.${showType[0].obvType}`;
    const revPath = `${this.stampsData._apiBase}/stamps/${showType[0].idRev}.${showType[0].revType}`;

    const description = showType[0].obvDescription ? (
                <div>
                  <p><b>Obv</b>: {showType[0].obvDescription} </p>
                  <p><b>Rev</b>: {showType[0].revDescription} </p>
                </div>
              ) : null;

    const attribution = typeAttributions.length>0 ? this.renderAttributions(typeAttributions) : null;

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
                <h5>Add a new specimen of the type</h5></div>);
    
        panelClass = "items-pad";
        break;
      case "addAttribution":
        items = 
          (<AddAttribution 
            onAdded={() => this.completeAdd()} 
            defaultValues = {[showType[0].idObv, showType[0].idRev]} />);
  
        itemsHeader = 
          (<div><span className="greyish"><a
                onClick = {()=>this.setState({mode: ""})}
                title="Cancel">x</a></span>&nbsp;
                <h5>Add a new attribution</h5></div>);
    
        panelClass = "items-pad";
        break;
      default:
        items = this.renderItems(showType);
  
        itemsHeader = (<h5>Known specimens</h5>);
    
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
        </div>
        <div>
          {itemsHeader}
          <div className={panelClass}>
            {items}
          </div>
        </div>
      </div>
    )
  }
}
