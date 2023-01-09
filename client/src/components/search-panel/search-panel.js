import React, { Component }  from 'react';
import InternalService from '../../services/internal-api';
import './search-panel.css';

export default class SearchPanel extends Component {
  stampsData = new InternalService();

  state = {
    saints: null,
    signs: null,
    crosses: null,
    letters: null
  };

  selectLetters(side) {
    document.getElementById(`${side}Letters`).style.display = 'flex';
    document.getElementById(`${side}Saints`).style.display = 'none';
    document.getElementById(`${side}Signs`).style.display = 'none';
    document.getElementById(`${side}Crosses`).style.display = 'none';
    document.getElementById(`${side}Text`).style.display = 'none';
  }

  selectSaints(side) {
    document.getElementById(`${side}Letters`).style.display = 'none';
    document.getElementById(`${side}Saints`).style.display = 'flex';
    document.getElementById(`${side}Signs`).style.display = 'none';
    document.getElementById(`${side}Crosses`).style.display = 'none';
    document.getElementById(`${side}Text`).style.display = 'none';
  }

  selectSigns(side) {
    document.getElementById(`${side}Letters`).style.display = 'none';
    document.getElementById(`${side}Saints`).style.display = 'none';
    document.getElementById(`${side}Signs`).style.display = 'flex';
    document.getElementById(`${side}Crosses`).style.display = 'none';
    document.getElementById(`${side}Text`).style.display = 'none';
  }

  selectCrosses(side) {
    document.getElementById(`${side}Letters`).style.display = 'none';
    document.getElementById(`${side}Saints`).style.display = 'none';
    document.getElementById(`${side}Signs`).style.display = 'none';
    document.getElementById(`${side}Crosses`).style.display = 'flex';
    document.getElementById(`${side}Text`).style.display = 'none';
  }

  selectText(side) {
    document.getElementById(`${side}Letters`).style.display = 'none';
    document.getElementById(`${side}Saints`).style.display = 'none';
    document.getElementById(`${side}Signs`).style.display = 'none';
    document.getElementById(`${side}Crosses`).style.display = 'none';
    document.getElementById(`${side}Text`).style.display = 'flex';
  }

  componentDidMount() {
    this.stampsData.getDictionaries()
      .then((body) => {
        this.setState({
          saints: body.data.saints,
          signs: body.data.signs,
          crosses: body.data.crosses,
          letters: this.stampsData.symbolsEnum
        });
        console.log(body.data);
      });
  }

  renderSaints(side, arr) {
    return arr.map(({id, name, epithet}) => {
      const uniqueKey = side+id;
      const uniqueGroup = `${side}saint`;
      return (
        <div className="form-check radio-item" key={uniqueKey}>
          <input className="form-check-input" type="radio" name={uniqueGroup} value={uniqueKey} />
          <label className="form-check-label">
            {name} ({epithet})
          </label>
        </div>
      );
    });
  }

  renderLetters(side, arr) {
    return arr.map((letter) => {
      const uniqueKey = side+letter;
      const uniqueGroup = `${side}letter`;
      return (
        <div className="form-check radio-item" key={uniqueKey}>
          <input className="form-check-input" type="radio" name={uniqueGroup} value={uniqueKey} />
          <label className="form-check-label">
            {letter}
          </label>
        </div>
      );
    });
  }

  renderSigns(side, arr) {
    return arr.map(({id, type}) => {
      const imagePath = `${this.stampsData._apiBase}/signs/${id}.${type}`;
      const uniqueGroup = `${side}sign`;
      const uniqueKey = `${side}sign${id}`;

      return (
        <div className="form-check radio-item paddington" key={uniqueKey}>
          <input className="form-check-input" type="radio" name={uniqueGroup} value={uniqueKey} />
          <label className="form-check-label">
            <img height='50px' className="rounded" src={imagePath} />
          </label>
        </div>
      );
    });
  }

  renderCrosses(side, arr) {
    return arr.map(({id}) => {
      const imagePath = `${this.stampsData._apiBase}/crosses/${id}.png`;
      const uniqueGroup = `${side}cross`;
      const uniqueKey = `${side}cross${id}`;

      return (
        <div className="form-check radio-item paddington" key={uniqueKey}>
          <input className="form-check-input" type="radio" name={uniqueGroup} value={uniqueKey} />
          <label className="form-check-label">
            <img height='50px' className="rounded" src={imagePath} />
          </label>
        </div>
      );
    });
  }

  render() {
    const { saints, letters, signs, crosses } = this.state;

    if (!saints) {
      return (
        <h3>List of saints is empty.</h3>
      )
    }

    const itemsObv = this.renderSaints("o", saints);
    const itemsRev = this.renderSaints("r", saints);
    const lettersObv = this.renderLetters("o", letters);
    const lettersRev = this.renderLetters("r", letters);
    const signsObv = this.renderSigns("o", signs);
    const signsRev = this.renderSigns("r", signs);
    const crossesObv = this.renderCrosses("o", crosses);
    const crossesRev = this.renderCrosses("r", crosses);

    return (
      <form action='search'>
        <div className="obv-drop">
          <h5>Obverse |</h5>
          <div className="btn-group" role="group" aria-label="Image Type">
            <button type="button" className="btn btn-secondary" onClick={() => this.selectSaints("obv")}>Saint</button>
            <button type="button" className="btn btn-secondary" onClick={() => this.selectLetters("obv")}>Letter</button>
            <button type="button" className="btn btn-secondary" onClick={() => this.selectSigns("obv")}>Tamgha</button>
            <button type="button" className="btn btn-secondary" onClick={() => this.selectCrosses("obv")}>Cross</button>
            <button type="button" className="btn btn-secondary" onClick={() => this.selectText("obv")}>Text</button>
          </div>
        </div>

        <div className="type-content" id="obvSaints">
          {itemsObv}
        </div>

        <div className="type-content hidden" id="obvLetters">
          {lettersObv}
        </div>

        <div className="type-content hidden" id="obvSigns">
          {signsObv}
        </div>

        <div className="type-content hidden" id="obvCrosses">
          {crossesObv}
        </div>

        <div className="pseudo-text hidden" id="obvText">
        </div>

        <p><br /></p>

        <div className="obv-drop">
          <h5>Reverse |</h5>
          <div className="btn-group" role="group" aria-label="Image Type">
            <button type="button" className="btn btn-secondary" onClick={() => this.selectSaints("rev")}>Saint</button>
            <button type="button" className="btn btn-secondary" onClick={() => this.selectLetters("rev")}>Letter</button>
            <button type="button" className="btn btn-secondary" onClick={() => this.selectSigns("rev")}>Tamgha</button>
            <button type="button" className="btn btn-secondary" onClick={() => this.selectCrosses("rev")}>Cross</button>
            <button type="button" className="btn btn-secondary" onClick={() => this.selectText("rev")}>Text</button>
          </div>
        </div>

        <div className="type-content" id="revSaints">
          {itemsRev}
        </div>

        <div className="type-content hidden" id="revLetters">
          {lettersRev}
        </div>

        <div className="type-content hidden" id="revSigns">
          {signsRev}
        </div>

        <div className="type-content hidden" id="revCrosses">
          {crossesRev}
        </div>

        <div className="pseudo-text hidden" id="revText">
        </div>

        <div className='main-button'>
          <button type="button" type="submit" className="btn btn-primary">Find</button>
        </div>

      </form>
    )
  }
}
