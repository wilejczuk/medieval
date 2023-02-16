import React, { Component }  from 'react';
import './search-band.css';
import InternalService from '../../../services/internal-api';
import SearchDetails from '../search-details';

export default class SearchBand extends Component {
  stampsData = new InternalService();

  state = {
    saints: null,
    signs: null,
    crosses: null,
    letters: null,
    currentSelection: "saints"
  };

  componentDidMount() {
    this.stampsData.getDictionaries()
      .then((body) => {
        this.setState({
          saints: body.data.saints.map(({id, name, epithet}) => {
            return {id: id, text: `${name} (${epithet})`}
          }),
          signs: body.data.signs.map(({id, type}) => {
            return {id: id, text: `${this.stampsData._apiBase}signs/${id}.${type}`}
          }),
          crosses: body.data.crosses.map(({id, type}) => {
            return {id: id, text: `${this.stampsData._apiBase}crosses/${id}.png`}
          }),
          letters: body.data.letters.map (({id, symbol}) => {
            return {id: id, text: symbol}
          })
          /*letters: this.stampsData.symbolsEnum.map ((item, index) => {
            return {id: index, text: item}
          })*/
        });
      });
  }

  selectItems(kind) {
    this.setState({ currentSelection: kind });
    this.props.onChange(kind, kind === "text" ? 0: null);
  }

  render() {
    const {side, onChange} = this.props;

    const { saints, currentSelection } = this.state;

    if (!saints) {
      return (
        <h3>List of saints is empty.</h3>
      )
    }

    return (
      <div>
        <div className="btn-group band" role="group" aria-label="Image Type">
          <button type="button" className="btn btn-secondary" onClick={() => this.selectItems("saints")}>Saint</button>
          <button type="button" className="btn btn-secondary" onClick={() => this.selectItems("letters")}>Letter</button>
          <button type="button" className="btn btn-secondary" onClick={() => this.selectItems("signs")}>Tamgha</button>
          <button type="button" className="btn btn-secondary" onClick={() => this.selectItems("crosses")}>Cross</button>
          <button type="button" className="btn btn-secondary" onClick={() => this.selectItems("text")}>Other</button>
        </div>

        <div className="type-content">
          <SearchDetails  side={side}
                          group={currentSelection}
                          arr={this.state[currentSelection]}
                          onChange={(group, id) => onChange(group, id)}
          />
        </div>
      </div>
    )
  }
}
