import React, { Component }  from 'react';
import InternalService from '../../services/internal-api';
import axios from 'axios';
import { setAuthToken } from '../../helpers/set-auth-token';
import './stamps-list.css';

export default class Stamps extends Component {

  stampsData = new InternalService();

  state = {
    stampsList: null,
  };

  componentDidMount() {
    this.stampsData.getStamps()
      .then((body) => {
        this.setState({
          stampsList: body.data,
        });
        console.log(body.data);
      });
  }

  renderItems(arr, signs) {
    return arr.map(({id, obverse, reverse, obv, rev}) => {
      const obvPath = `${this.stampsData._apiBase}/stamps/${obv}.png`;
      const revPath = `${this.stampsData._apiBase}/stamps/${rev}.png`;
      return (
        <div key={id}>
          <div>
            <img src={obvPath} height="100" />
            <img src={revPath} height="100" />
          </div>
          <div className="top-add">
            <div>{obverse} <br /> {reverse}</div>
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

    const items = this.renderItems(stampsList);

    return (
      <div className="flex-header">
        {items}
      </div>
    )
  }
}
