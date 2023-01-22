import React, { Component }  from 'react';
import References from './references';

import InternalService from '../../services/internal-api';
import './type.css';

export default class Type extends Component {

  stampsData = new InternalService();

  state = {
    showType: null
  };

  componentDidMount() {
    let searchParams = this.props.match.params;
    this.stampsData.getType([searchParams["o"],searchParams["r"]])
      .then((body) => {
        this.setState({
          showType: body.data,
        });
        console.log(body.data);
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
        let params = '';
        if (geo) params = geo;
        if (weight) params += `. Weight: ${weight} g`;
        if (maxDiameter) params += `. Diameter: ${maxDiameter} mm`;

        return (
          <div key={id} className="items-pad">
            <img src={path} height="150" alt="Specimen" />
            <div className="paddington">
              {params}
            </div>
            <References refs={refs}/>
          </div>
        );
    });
  }

  render() {

    const { showType } = this.state;

    if (!showType) {
      return (
        <h3>List of stamps is empty.</h3>
      )
    }

    const obvPath = `${this.stampsData._apiBase}/stamps/${showType[0].idObv}.png`;
    const revPath = `${this.stampsData._apiBase}/stamps/${showType[0].idRev}.png`;

    const items = this.renderItems(showType);

    return (
      <div className="main-grid">
        <div className="stamp-overview">
            <img src={obvPath} height="120" alt="Obverse" />
            <img src={revPath} height="120" alt="Reverse" />
        </div>
        <div>
          <h5>Known specimens</h5>
          <div className="items">
            {items}
          </div>
        </div>
      </div>
    )
  }
}
