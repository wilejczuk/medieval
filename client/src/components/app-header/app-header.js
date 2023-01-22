import React, { Component }  from 'react';
import LogOut from '../log-out';
import './app-header.css';

import InternalService from '../../services/internal-api';

export default class AppHeader extends Component {

  stampsData = new InternalService();
  logoURL = `${this.stampsData._clientBase}logo96.png`;
  svenssons = `${this.stampsData._clientBase}svenssons.jpeg`;

  render() {
    return (
      <div className="site-header">
        <div className="logo"><a href="/"><img src={this.logoURL} /></a></div>
        <div>
          <h1>Seals of Kievan Rus'</h1>
          <h4>for documents and fur money</h4>
        </div>
        <div>
          БЕЛ | УКР | РУС | ENG
        </div>
        <div>
          <img src={this.svenssons} width="200px"/>
        </div>

      </div>
    )
  }
}
