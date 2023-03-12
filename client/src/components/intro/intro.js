import React, { Component }  from 'react';
import InternalService from '../../services/internal-api';
import './intro.css';

export default class Intro extends Component {

  data = new InternalService();

  state = {
    dukesList: null
  };

  // renderLoginOrLogout - полностью уехал в LoginForm

  componentDidMount() {
    this.data.getDukes()
        .then((body) => {
          console.log(body.data)
          this.setState({
            dukesList: body.data
          });
        });
  }

  renderItems(arr) {
    let firstCN = ``;
    let secondCN = ``;
    let counter = 0;
    switch(arr.length%3) {
      case 1:
        firstCN =`first-1uneven`;
        secondCN = `third`;
        break;
      case 2:
        firstCN =`first-2uneven`;
        secondCN = `third`;
        break;
      default:
    }

    return arr.map(({
        id,
        name,
        dateBirth,
        dateDeath,
        datePower,
        birthProximity,
        powerProximity,
        deathProximity,
        pic, ext
      }) => {
      const title = `${name} (${birthProximity?'≈':''}${dateBirth} ϡ ${powerProximity?'≈':''}${datePower} † ${deathProximity?'≈':''}${dateDeath})`;
      function link() {window.location.replace(`/duke/${id}`)};
      const uniqueKey = `duke${id}`;
      let className = `box `;

      let sectionStyle = {};
      if (pic)
        sectionStyle = {
          backgroundImage: `url('${this.data._apiBase}illustrations/${pic}.${ext}')`,
          backgroundSize: `cover`,
          textShadow: `2px 2px black`
        };

      counter++;
      switch(counter) {
        case 1:
          className += firstCN; 
          break;
        case 2:
          className += secondCN;
          break;
        default:
      }
      return (
          <div key={uniqueKey} className={className} style={sectionStyle} onClick={link}>
                {title}
          </div>
      );
    });
  }
 
  render() {
    const { dukesList } = this.state;
    
    if (!dukesList) {
      return (<br />)
    }

    const items = this.renderItems(dukesList);

    return (
      <div className="bottom">
        <div className="padding-left wrapper">
          {items}
        </div>
      </div>
    )
  }
}

// authenticate - полностью уехал в LoginForm

/*
    const needLogin = this.renderLoginOrLogout(localStorage.getItem("token") ? true : false);


      <div className="padding-left">
        <p>Welcome to the seals database! You can <a href="/search">search it</a>, select items <a href='/'>on the map</a>, 
        or review items by the issuer below:</p>
        {needLogin}
      </div>
*/