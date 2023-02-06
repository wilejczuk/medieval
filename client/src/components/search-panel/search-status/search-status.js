import React, { Component }  from 'react';
import InternalService from '../../../services/internal-api';

import './search-status.css';

export default class SearchStatus extends Component {
  render() {

    const {selection} = this.props;
    if (!selection[0]) {
      return (
        <div className="grid-element">
           ← Define some search criteria at the left
        </div>
      )
    }
    
    return (
      <div className="grid-element">
        <span className="greyish"><a href="/search" title="Remove the criteria">x</a></span> Selected: {selection[0]} / {selection[1]}
      </div>
    )
  }
}
