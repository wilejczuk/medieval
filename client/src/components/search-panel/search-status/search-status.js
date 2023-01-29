import React, { Component }  from 'react';
import InternalService from '../../../services/internal-api';

import './search-status.css';

export default class SearchStatus extends Component {
  stampsData = new InternalService();

  state = {
    obv: null,
    rev: null
  };

  requestDetails (side, group, index) {
    switch (group) {
      case "saints":
        this.stampsData.getSaint([index])
          .then((body) => {
            this.setState({[side]: body.data});
          });
        break;
      case "crosses":
        this.stampsData.getCross([index])
          .then((body) => {
            this.setState({[side]: body.data});
          });
        break;
      default:
    }
  }

  componentDidMount() {
    const {selection} = this.props;
    if (selection["od"]!='null') this.requestDetails("obv", selection["o"], selection["od"]);
    if (selection["rd"]!='null') this.requestDetails("rev", selection["r"], selection["rd"]);
  }

  render() {

    let {obv, rev} = this.state;
    const {selection} = this.props;

    console.log(selection);
    if (!selection["o"]) {
      return (
        <div className="grid-element">
           ← Define some search criteria at the left
        </div>
      )
    }

    if (obv===null) obv = selection["o"];
    if (rev===null) rev = selection["r"];

    return (
      <div className="grid-element">
        <span className="greyish"><a href="/search" title="Remove the criteria">x</a></span> Selected: {obv} / {rev}
      </div>
    )
  }
}
