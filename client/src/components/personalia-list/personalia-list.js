import React, { Component }  from 'react';
import InternalService from '../../services/internal-api';
import axios from 'axios';
import { setAuthToken } from '../../helpers/set-auth-token';
import './personalia-list.css';

export default class Personalia extends Component {

  personData = new InternalService();

  state = {
    peopleList: null,
  };

  componentDidMount() {
    this.personData.getPersonalia()
      .then((body) => {
        this.setState({
          peopleList: body.data,
        });
        console.log(body.data);
      });
  }

  renderItems(arr, signs) {
    return arr.map(({id, name, type, idSign}) => {
      const imgPath = idSign? `${this.personData._apiBase}/signs/${idSign}.${type}`:null;
      return (
        <tr className="item-list list-group" key={id}>
          <td className="list-group-item">
            {name}
          </td>
          <td className="list-group-item">
            <img src={imgPath} height="40" />
          </td>
        </tr>
      );
    });
  }

  render() {

    const { peopleList } = this.state;

    if (!peopleList) {
      return (
        <h3>The personalia list is empty.</h3>
      )
    }

    const items = this.renderItems(peopleList);

    return (
      <div>
        <h3>Dukes that sealed goods</h3>
        <div><a href="personalia/add">Edit the list</a></div>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Sign</th>
            </tr>
          </thead>
          <tbody>
              {items}
          </tbody>
        </table>
      </div>
    )
  }
}
