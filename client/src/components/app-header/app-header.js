import React, { Component }  from 'react';
import LogOut from '../log-out';
import './app-header.css';

import InternalService from '../../services/internal-api';

export default class AppHeader extends Component {

  stampsData = new InternalService();
  logoURL = `${this.stampsData._clientBase}logo96.png`;

  render() {
    const sectionStyle = {
      backgroundImage: `url('${this.stampsData._clientBase}favicon.ico')`
    };
    
    const { loggedUser } = this.props;
    
    return (
      <div className="header">
        <div className="sides">
          <a  href="/" className="author logo" style={sectionStyle}></a><br />
        </div>
        <div className="sides">
        <div className="meta right">Welcome, { loggedUser }!</div>
          <a href="/search" className="menu">SEARCH</a>
        </div>
        <div className="info">
          <h4>SEALS OF</h4>
          <h1>KIEVAN RUS'</h1>
          <div className="meta">
            for documents and fur money
          </div>
</div>
</div>
    )
  }
}
