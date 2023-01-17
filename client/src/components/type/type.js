import React, { Component }  from 'react';

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

  renderItems(arr, signs) {
    return arr.map(({id, imgType}) => {
      const path = `${this.stampsData._apiBase}specimens/${id}.${imgType}`;
      return (
        <div key={id}>
          <div>
            <img src={path} height="200" alt="Specimen" />
          </div>
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

    const items = this.renderItems(showType);

    return (
      <div className="flex-header">
        {items}
      </div>
    )
  }
}
