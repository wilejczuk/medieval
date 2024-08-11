import React, { Component }  from 'react';
import Loading from '../loading';
import References from './references'; 
import InternalService from '../../services/internal-api';

import './specimens-list.css';

export default class Specimens extends Component {

  stampsData = new InternalService();

  componentDidMount() {
    const { scrollToElement, selection } = this.props;
    const elementId = `specimen${selection}`;
    if (scrollToElement) setTimeout(()=> scrollToElement(elementId), 1000);
  }

  renderItems(arr) {
    let existingSpecimens = [];
    let unpackedReferences = [];
    arr.map(({id, idObv, idRev, imgType, name, year, page, number, geo, weight, maxDiameter, copyright}) => {
      if (existingSpecimens.indexOf(id) === -1) {
        existingSpecimens.push(id);
        unpackedReferences.push({id, idObv, idRev, imgType, geo, weight, maxDiameter, copyright, refs: [{id, name, year, page, number}]});
      } else {
        unpackedReferences.find(o => o.id === id)['refs'].push({id, name, year, page, number});
      }
    });

    const handleZoom = () => {
      document.querySelector('.zoomed-image-container').style.display = 'block';
    };

    return unpackedReferences.map(({id, idObv, idRev, imgType, refs, geo, weight, maxDiameter, copyright}) => {
        const path = `${this.stampsData._apiBase}specimens/${id}.${imgType}`;
        const image = (copyright && !localStorage.getItem("token")) ? null : 
        (<a href={path} target="_blank" data-zoompic>
            <img src={path} height="150" alt="Specimen" />
        </a>);
        const uniqueKey = `specimen${id}`;
        const inTypeLink = `${this.stampsData._clientBase}type/${idObv}/${idRev}/${id}`;
        const catNo = (<span className='cat-no'><a href={inTypeLink}>Cat.# {id}</a></span>);
        let params = ` `;
        if (geo) params += `${geo}. `;
        if (weight) params += `Weight: ${weight} g. `;
        if (maxDiameter) params += `Diameter: ${maxDiameter} mm`;

        return (
          <div key={uniqueKey} className="items-pad" id={uniqueKey}>
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
