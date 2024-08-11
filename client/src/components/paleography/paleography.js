import React, { Component }  from 'react';
import InternalService from '../../services/internal-api';
import './paleography.css';

export default class Paleography extends Component {

  data = new InternalService();

  state = {
    lettersCorrespondance: null
  };

  componentDidMount() {
    this.data.getPaleography()
        .then((body) => {
          this.setState({
            lettersCorrespondance: body.data
          });
        });
  }

  renderItems(arr) {
    return arr.map(({
        id,
        symbol,
        corresponding,
        corresponding_id
      }) => {

      const uniqueKey = `letter${id}`;
      const correspondingLetters = corresponding.split(',');
      const correspondingIds = corresponding_id.split(',');

      let searchLinks = correspondingLetters.map((letter, i) => {
        const searchLink = `${this.data._clientBase}search/letters/${id}/letters/${correspondingIds[i]}`;
        let letterImage = `${this.data._apiBase}letters/${correspondingIds[i]}.jpg`;
        return <a key={i} href={searchLink}><img className="dependent_images" src={letterImage} alt={letter} /></a>;
      });

      let letterImage = `${this.data._apiBase}letters/${id}.jpg`;
    
      const renderedSearchLinks = searchLinks.reduce((acc, link, index) => {
        return index === searchLinks.length - 1 
          ? [...acc, link] 
          : [...acc, link, " "];
      }, []);

      return (
          <div key={uniqueKey} className='letter_box'>
                <img className="main_image" src={letterImage} alt={symbol} /> 
                <div className='smaller'>Combined with: {renderedSearchLinks}</div>
          </div>
      );
    });
  }
 
  render() {
    const { lettersCorrespondance } = this.state;

    if (!lettersCorrespondance) {
      return (<div>Loading</div>)
    }

    const items = this.renderItems(lettersCorrespondance);

    return (
      <div className="footer-widget-heading padding-both">
      <h3>Paleography</h3>
      <div className="bottom">
        <div className="padding-both wrapper grid-container">
          {items}
        </div>
      </div>
      </div>
    )
  }
}