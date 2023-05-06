import React, { Component }  from 'react';
import InternalService from '../../services/internal-api';
import './intro.css';

export default class Intro extends Component {

  data = new InternalService();

  state = {
    dukesList: null
  };

  componentDidMount() {
    let searchParam = this.props.match ? this.props.match.params["br"] : null;
    this.data.getDukes([searchParam])
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
    const columns = this.props.match ? (arr.length+1)%3 : arr.length%3;
    switch(columns) {
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
        idBranch,
        idHusband,
        pic, ext
      }) => {

      const birth = dateBirth ? `${birthProximity?'≈':''}${dateBirth} ` : '';
      const power = datePower ? `ϡ ${powerProximity?'≈':''}${datePower} ` : '';
      const death = dateDeath ? `† ${deathProximity?'≈':''}${dateDeath}` : '';
      const dates = `${birth}${power}${death}`;
      const title = `${name} (${dates})`;
      function link() {window.location.href=`/person/${id}`};
      const uniqueKey = `duke${id}`;
      let className = `box `;

      let sectionStyle = {};
      if (pic)
        sectionStyle = {
          backgroundImage: `url('${this.data._apiBase}illustrations/${pic}.${ext}')`,
          backgroundSize: `cover`,
          textShadow: `2px 2px black`
        };

      const specialGroup = (idBranch === 7) ? <img className='imageShade' height='50' src='./../../../icons/priest.png' /> : 
        idHusband ? <img className='imageShade' height='50' src='./../../../icons/princess.png' /> : null  ;  


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
                <div className='iconGroup'>{specialGroup}</div>
          </div>
      );
    });
  }
 
  render() {
    const { dukesList } = this.state;

    const styleAll = {
      backgroundImage: `url('${this.data._apiBase}illustrations/0.jpeg')`,
      backgroundSize: `cover`,
      textShadow: `2px 2px black`
    };
    
    const seeAll = this.props.match ? (
      <div key="seeAll" style = {styleAll} className='box box-all' onClick={()=>window.location.href=`/`}>
        See dukes of different branches
      </div>) : null;

    if (!dukesList || dukesList.length === 0) {
      return seeAll
    }

    const items = this.renderItems(dukesList);
    const branch = this.props.match ? 
      (<div className="padding-both wrapper grid-container">{dukesList[0].branch}</div>) : null;



    return (
      <div className="bottom">
        {branch}
        <div className="padding-both wrapper grid-container">
          {items}
          {seeAll}
        </div>
      </div>
    )
  }
}