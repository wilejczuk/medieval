import React, { Component }  from 'react';
import Specimens from '../specimens-list/specimens-list';
import Loading from '../loading';

import InternalService from '../../services/internal-api';
import './by_publication.css';

export default class ByPublication extends Component {

  stampsData = new InternalService();

  state = {
    showType: null,
    loading: true
  };

  componentDidMount() {
    let searchParams = this.props.match.params;
    
    this.stampsData.getPublicationSpecimen([searchParams["id"]])
      .then((body) => {
        this.setState({
          showType: body.data,
        });
      });
      this.setState({loading: false});
  }

  render() {

    const { showType } = this.state;
    const searchParams = this.props.match.params;

    if (!showType) {
      return (
        <Loading />
      )
    }

    let items, itemsHeader, panelClass;

    items = (<Specimens items={showType} />);
    itemsHeader = (<div className="footer-widget-heading"><h3>Known specimens</h3></div>);
    panelClass = "items";

    return (
      <div className="main-grid">
        <div className="footer-widget-heading padding-left">
          <h3>{showType[0].name}</h3>
          Seals published: {showType.length} 
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
