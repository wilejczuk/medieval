import React, { Component }  from 'react';
import LogOut from '../log-out';
import './app-header.css';

export default class AppHeader extends Component {
  render() {
    return (
      <div className="site-header">
        <div className="logo"><a href="/"><img src='./logo96.png' /></a></div>
        <div>
          <h1>XI-XIV ct. lead seal findings</h1>
          <h3>in Eastern Europe</h3>
        </div>
      </div>
    )
  }
}
