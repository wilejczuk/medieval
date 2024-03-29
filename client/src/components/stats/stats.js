import React, { Component }  from 'react';

import InternalService from '../../services/internal-api';
import Publications from './publications';
import './stats.css';

export default class Stats extends Component {

  stampsData = new InternalService();

  state = {
    allPublishedSpecimens: null,
    publicationsAdvanced: null
  };

  componentDidMount() {    
    this.stampsData.getPublicationSpecimens()
      .then((body) => {
        this.setState({
          allPublishedSpecimens: body.data,
        });
      });
    this.stampsData.getPublicationsAdvanced()
    .then((body) => {
      this.setState({
        publicationsAdvanced: body.data,
      });
    });  
  }

  renderSites(arr) {
    return arr.map(({id, name, count, year}) => {

      if (count===0) return;

      const uniqueKey = `pub_${id}`;
      const spanDynamicStyle = {
        width: count
      };

      const longName = name.includes(', Unpublished,') ? (<span>&nbsp; Unpublished</span>) : (<span>&nbsp; <i>{year}</i> <span className="date">{name}</span></span>);

      return (
        <li key={uniqueKey}>
          <span className = "striped" style={spanDynamicStyle} wdith='200px'>&nbsp;</span> 
          {longName}
        </li>
      );
    });
  }

  render() {

    const { allPublishedSpecimens, publicationsAdvanced } = this.state;

    if (!allPublishedSpecimens || !publicationsAdvanced) {
      return (
        <h3>List is empty.</h3>
      )
    }

    const pubList = this.renderSites(allPublishedSpecimens);

    return (
      <div className='footer-widget-heading padding-both'> 
        <h3>By publication</h3>
        <ul className='nodot'> 
          {pubList}
        </ul> 
      </div>
    )
  }
}
