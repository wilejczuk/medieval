import React, { Component }  from 'react';
import InternalService from '../../services/internal-api';
import axios from 'axios';
import { setAuthToken } from '../../helpers/set-auth-token';

export default class Personalia extends Component {

  personData = new InternalService();

  loadData() {
    this.personData.getPersonalia()
      .then((body) => console.log(body))
      .catch(error => console.log(error));
  }

  constructor() {
    super();
    this.loadData();
  }

  render() {
    return <div>You are logged in. <form><button formAction="/logout">Log out</button></form></div>
  }
}
