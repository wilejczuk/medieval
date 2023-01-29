import React, { Component }  from 'react';
import SearchStatus from '../search-panel/search-status';

import InternalService from '../../services/internal-api';
import './stamps-list.css';

export default class Stamps extends Component {

  stampsData = new InternalService();

  state = {
    stampsList: null,
  };

  componentDidMount() {
    let searchParams = this.props.match.params;

    if (searchParams["o"])
      this.stampsData.getSomeStamps([searchParams["o"],searchParams["od"],
                                    searchParams["r"],searchParams["rd"]])
        .then((body) => {
          this.setState({
            stampsList: body.data,
          });
        });
    else {
      console.log ("no params");
      this.stampsData.getStamps()
        .then((body) => {
          this.setState({
            stampsList: body.data,
          });
        });
    }
  }

  renderItems(arr) {
    return arr.map(({obverse, reverse, obv, rev, cnt}) => {
      const obvPath = `${this.stampsData._apiBase}/stamps/${obv}.png`;
      const revPath = `${this.stampsData._apiBase}/stamps/${rev}.png`;
      const specimensPath = `${this.stampsData._clientBase}type/${obv}/${rev}`;
      const uniqueKey = `${obv}-${rev}`;
      return (
        <div key={uniqueKey}>
          <div>
            <a href={specimensPath}>
              <img src={obvPath} height="100" alt="Obverse" />
              <img src={revPath} height="100" alt="Reverse" />
            </a>
          </div>
          <div className="top-add">
            <div>{obverse} <br /> {reverse} <div className="quantity"> <b>Экз</b>.: {cnt} в базе</div></div>
          </div>
        </div>
      );
    });
  }

  render() {

    const { stampsList } = this.state;
    let searchParams = this.props.match.params;

    if (!stampsList) {
      return (
        <h3>List of stamps is empty.</h3>
      )
    }

    if (stampsList.length === 0) {
      return (
        <div className="pad-left">
          <SearchStatus selection={searchParams} />
          <h4>Found no records corresponding to the search criteria. </h4>
          <p>Please try again.</p>
        </div>
      )
    }

    const items = this.renderItems(stampsList);

    return (
      <div className="flex-header">
        <SearchStatus selection={searchParams} />
        {items}
      </div>
    )
  }
}
