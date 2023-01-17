import React, { Component }  from 'react';

import InternalService from '../../services/internal-api';
import './stamps-list.css';

export default class Stamps extends Component {

  stampsData = new InternalService();

  state = {
    stampsList: null,
  };

  componentDidMount() {
    let searchParams = this.props.match.params; // Example: [2,1,1,2]
    this.stampsData.getSomeStamps([searchParams["o"],searchParams["od"],
                                  searchParams["r"],searchParams["rd"]])
      .then((body) => {
        console.log(body.data);
        this.setState({
          stampsList: body.data,
        });
      });
  }

  renderItems(arr, signs) {
    return arr.map(({id, obverse, reverse, obv, rev, cnt}) => {
      const obvPath = `${this.stampsData._apiBase}/stamps/${obv}.png`;
      const revPath = `${this.stampsData._apiBase}/stamps/${rev}.png`;
      const specimensPath = `${this.stampsData._clientBase}type/${obv}/${rev}`;
      return (
        <div key={id}>
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

    if (!stampsList) {
      return (
        <h3>List of stamps is empty.</h3>
      )
    }

    if (stampsList.length === 0) {
      return (
        <div className="pad-left">
          <h4>Found no records corresponding to the search criteria. </h4>
          <p>Please try again.</p>
        </div>
      )
    }

    const items = this.renderItems(stampsList);

    return (
      <div className="flex-header">
        {items}
      </div>
    )
  }
}
