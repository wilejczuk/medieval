import React, { Component }  from 'react';
import Specimens from '../specimens-list/specimens-list';

import InternalService from '../../services/internal-api';
import './location.css';

export default class Location extends Component {

  stampsData = new InternalService();

  state = {
    showType: null
  };

  componentDidMount() {
    let searchParams = this.props.match.params;
    
    this.stampsData.getLocationSpecimens([searchParams["geo"]])
      .then((body) => {
        this.setState({
          showType: body.data,
        });
      });
  }

  renderLiteratureSums(arr) {
    return arr.map(({name, val}) => {
      return (
        <div key={name}>
          <span className="date">{name}</span> : {val}
          <br /> <br />
        </div>
      );
    });
  }

  render() {

    const { showType } = this.state;
    const searchParams = this.props.match.params;

    if (!showType) {
      return (
        <h3>List of stamps is empty.</h3>
      )
    }

    const geo = searchParams["geo"];

    let arrLiterature = [];
    showType.map( 
      (currentValue) => { 
        const found = arrLiterature.find(el => (el.name === currentValue.name || currentValue.name === null));
        if (!found) {
          arrLiterature.push({name: currentValue.name ? currentValue.name : 'Unpublished', val: 1});
        }
        else found.val+=1;
      }
    );
    console.log(showType);
    const literatureSums = this.renderLiteratureSums(arrLiterature);

    let items, itemsHeader, panelClass;

    items = (<Specimens items={showType} />);
    itemsHeader = (<div className="footer-widget-heading"><h3>Known specimens</h3></div>);
    panelClass = "items";

    return (
      <div className="main-grid">
        <div className="footer-widget-heading padding-left">
          <h3>{geo}</h3>
          {literatureSums}
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
