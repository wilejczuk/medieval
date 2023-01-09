import React, { Component }  from 'react';
import InternalService from '../../services/internal-api';
import axios from 'axios';
import { setAuthToken } from '../../helpers/set-auth-token';
import './personalia-new.css';

import LogOut from '../log-out'

export default class PersonaliaNew extends Component {

  personData = new InternalService();

  state = {
    peopleList: null,
    saintsList: null
  };

  componentDidMount() {
    this.personData.getPersonaliaToAdd()
      .then((body) => {
        this.setState({
          peopleList: body.data.personalia,
          saintsList: body.data.saints
        });
      });
  }

  renderSaints(arr) {
    return arr.map(({id, name, epithet}) => {
      const nameWithEpithet = `${name} (${epithet})`;
      return (
        <option key={id} value={id}>{nameWithEpithet}</option>
      );
    });
  }

  renderFathers(arr) {
    return arr.map(({id, name}) => {
      return (
        <option key={id} value={id}>{name}</option>
      );
    });
  }

  render() {

    const { peopleList, saintsList } = this.state;

    if (!peopleList) {
      return (
        <LogOut />
      )
    }

    const saints = this.renderSaints(saintsList);
    const fathers = this.renderFathers(peopleList);

    return (
      <div>
        <LogOut />
        <h1>Add a Persona</h1>
        <form action='addPersona' method='post'>
          <div>
            <label>Имя: </label>
            <input type="text" name="personaName" required />
          </div>
          <div>
            <label>Патрон: </label>
            <select name="christianPatron">
              <option value="0">Неизвестен</option>
              {saints}
            </select>
          </div>
          <div>
            <label>Отец: </label>
            <select name="father">
              <option value="0">Еще не добавлен</option>
              {fathers}
            </select>
          </div>
          <div>
            <label>Родился: </label>
            <input type="number" placeholder="YYYY" min="950" max="1500" name="dateBirth" />
            <input type="checkbox" name="birthProximity" value="0" /> Примерно
          </div>
          <div>
            <label>Вступил в права: </label>
            <input type="number" placeholder="YYYY" min="950" max="1500" name="datePower" />
            <input type="checkbox" name="powerProximity" value="0" /> Примерно
          </div>
          <div>
            <label>Умер: </label>
            <input type="number" placeholder="YYYY" min="950" max="1500" name="dateDeath" />
            <input type="checkbox" name="deathProximity"value="0" /> Примерно
          </div>
          <div>
            <button type="submit">Register</button>
          </div>
        </form>
      </div>
    )
  }
}
