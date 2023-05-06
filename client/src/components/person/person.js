import React, { Component }  from 'react';
import InternalService from '../../services/internal-api';
import './person.css';

export default class Person extends Component {

  data = new InternalService();

  state = {
    duke: null
  };

  componentDidMount() {
    let searchParams = this.props.match.params;

    this.data.getDuke([searchParams["id"]])
        .then((body) => {
          this.setState({
            duke: body.data
          });
        });
  }

  renderItems(arr) {
    return arr.map(({id, son}) => {
        const uniqueKey = `son${id}`;
        return (
          <li key={uniqueKey}>
             <a href={id}>{son}</a> 
          </li>
        );
    });
  }
  
  render() {
    const { duke } = this.state;
    
    if (!duke) {
      return (<br />)
    }
    const descendants = this.renderItems(duke.descendants);

    const classNames = 'padding-left padding-bottom dukes-family';

    const birth = duke.duke.dateBirth ? `${duke.duke.birthProximity?'≈':''}${duke.duke.dateBirth} ` : '';
    const power = duke.duke.datePower ? `ϡ ${duke.duke.powerProximity?'≈':''}${duke.duke.datePower} ` : '';
    const death = duke.duke.dateDeath ? `† ${duke.duke.deathProximity?'≈':''}${duke.duke.dateDeath}` : '';
    const dates = `${birth}${power}${death}`;
    const father = duke.duke.father ? (<div className={classNames}>Father: <li><a href={duke.duke.idFather}>{duke.duke.father}</a></li></div>) : null;
    const husband = duke.duke.husband ? (<div className={classNames}>Husband: <li><a href={duke.duke.idHusband}>{duke.duke.husband}</a></li></div>) : null;
    const wife = duke.duke.wife ? (<div className={classNames}>Wife: <li><a href={duke.duke.idWife}>{duke.duke.wife}</a></li></div>) : null;
    const descendantItems = duke.descendants.length > 0 ? (<div className={classNames}>Descendants: {descendants}</div>) : null;
    const branchLink = `/${duke.duke.idBranch}`;
    const branch = duke.duke.branch ? (<div>Branch: <a href={branchLink}>{duke.duke.branch}</a></div>) : null;

    return (
      <div>
        <div className="padding-left footer-widget-heading"><h3>{duke.duke.name}</h3></div>
        <div className="padding-left padding-bottom dukes-family" style={{float: 'right'}}>{branch}</div>
        <div className="padding-left padding-bottom">{dates}</div>
        {father}
        {husband}
        {wife}
        {descendantItems}
        <div className="padding-left story-description">{duke.duke.story}</div>
      </div>
    )
  }
}