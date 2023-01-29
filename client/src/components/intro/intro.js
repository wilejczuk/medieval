import React, { Component }  from 'react';
import './intro.css';

export default class Intro extends Component {

  render() {
    return (
      <div className="padding-left">
        <p>Welcome to the seals database.</p>
        <p><a href="/search">Search it</a> or select items on the map aside.</p>
        <p> Мы надеемся, что данная база данных поможет исследователям глубже понять историю Древней Руси. </p>
      </div>
    )
  }
}
