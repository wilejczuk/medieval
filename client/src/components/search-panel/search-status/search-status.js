import React, { Component }  from 'react';

import './search-status.css';

export default class SearchStatus extends Component {
  render() {
    
    const {selection} = this.props;
    if (!selection[0] && !window.location.href.includes("duke")) {
      return (
        <div className="grid-element padding-bottom">
           ← Define some search criteria at the left
        </div>
      )
    }

    if (window.location.href.includes("duke")) {
      return (
        <div className="grid-element padding-bottom">
        </div>
      )
    }    

    return (
      <div className="grid-element padding-bottom">
        <span className="greyish"><a href="/search" title="Remove the criteria">x</a></span> Selected: {selection[0]} / {selection[1]}
      </div>
    )
  }
}
