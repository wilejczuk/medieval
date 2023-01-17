import React, { Component }  from 'react';
import LogOut from '../log-out';
import './app-header.css';

import InternalService from '../../services/internal-api';

export default class AppHeader extends Component {

  stampsData = new InternalService();
  logoURL = `${this.stampsData._clientBase}logo96.png`;

  render() {
    return (
      <div className="site-header">
        <div className="logo"><a href="/"><img src={this.logoURL} /></a></div>
        <div>
          <h1>XI-XIV ct. lead seal findings</h1>
          <h3>in Eastern Europe</h3>
        </div>
      </div>
    )
  }
}
