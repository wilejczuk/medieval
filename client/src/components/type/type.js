import React, { Component }  from 'react';
import References from './references';
import AddSpecimen from './add-specimen';

import InternalService from '../../services/internal-api';
import './type.css';

export default class Type extends Component {

  stampsData = new InternalService();

  state = {
    showType: null,
    addNewSpecimen: false
  };

  componentDidMount() {
    let searchParams = this.props.match.params;
    this.stampsData.getType([searchParams["o"],searchParams["r"]])
      .then((body) => {
        this.setState({
          showType: body.data,
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

  canAdd(auth) {
    if (auth && !this.state.addNewSpecimen)
      return (
        <button className="btn btn-secondary" title="Add another specimen"
          onClick={()=>{
            this.setState({
              addNewSpecimen: true
            });
          }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus" viewBox="0 0 16 16">
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"></path>
          </svg>
        </button>
      )
  }

  completeAdd() {
    this.componentDidMount();
    this.setState({
      addNewSpecimen: false
    });
  }

  render() {

    const { showType, addNewSpecimen } = this.state;

    if (!showType) {
      return (
        <h3>List of stamps is empty.</h3>
      )
    }
    const addMore = this.canAdd(localStorage.getItem("token") ? true : false);

    const obvPath = `${this.stampsData._apiBase}/stamps/${showType[0].idObv}.png`;
    const revPath = `${this.stampsData._apiBase}/stamps/${showType[0].idRev}.png`;

    const items = addNewSpecimen ?
      (<AddSpecimen onAdded={() => this.completeAdd()} defaultValues = {[showType[0].idObv, showType[0].idRev]} />)
      : this.renderItems(showType);

    const itemsHeader = addNewSpecimen ?
    (<div><span className="greyish"><a
          onClick = {()=>this.setState({addNewSpecimen: false})}
    title="Cancel">x</a></span>  <h5>Add a new specimen of the type</h5></div>)
    : (<h5>Known specimens</h5>);

    const panelClass = addNewSpecimen ? "items-pad" : "items";

    return (
      <div className="main-grid">
        <div className="stamp-overview">
            <img src={obvPath} height="120" alt="Obverse" />
            <img src={revPath} height="120" alt="Reverse" />
            <br />
            {addMore}
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
