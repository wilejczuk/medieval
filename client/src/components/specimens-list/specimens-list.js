import React, { Component }  from 'react';
import Loading from '../loading';
import References from './references'; 
import InternalService from '../../services/internal-api';

import './specimens-list.css';

export default class Specimens extends Component {

  stampsData = new InternalService();

  renderItems(arr) {
    let existingSpecimens = [];
    let unpackedReferences = [];
    arr.map(({id, imgType, name, year, page, number, geo, weight, maxDiameter, copyright}) => {
      if (existingSpecimens.indexOf(id) === -1) {
        existingSpecimens.push(id);
        unpackedReferences.push({id, imgType, geo, weight, maxDiameter, copyright, refs: [{id, name, year, page, number}]});
      } else {
        unpackedReferences.find(o => o.id === id)['refs'].push({id, name, year, page, number});
      }
    });

    return unpackedReferences.map(({id, imgType, refs, geo, weight, maxDiameter, copyright}) => {
        const path = `${this.stampsData._apiBase}specimens/${id}.${imgType}`;
        const image = (copyright && !localStorage.getItem("token")) ? null : (<img src={path} height="150" alt="Specimen" />);
        const uniqueKey = `specimen${id}`;
        const catNo = (<span className='cat-no'>Cat.# {id}</span>);
        let params = ` `;
        if (geo) params += `${geo}. `;
        if (weight) params += `Weight: ${weight} g. `;
        if (maxDiameter) params += `Diameter: ${maxDiameter} mm`;

        return (
          <div key={uniqueKey} className="items-pad">
            {image}
            <div className="paddington">
              {catNo}
              {params}
            </div>
            <References onAdded={() => this.completeAdd()} refs={refs}/>
          </div>
        );
    });
  }

  completeAdd() {
    this.props.onAdded();
  }

  render() {
    const { items } = this.props;

    if (!items) {
      return (
        <Loading />
      )
    }

    return this.renderItems(items);
  }
}
