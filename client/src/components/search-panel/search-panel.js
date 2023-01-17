import React, { Component }  from 'react';
import InternalService from '../../services/internal-api';
import './search-panel.css';
import SearchBand from './search-band';

export default class SearchPanel extends Component {
  stampsData = new InternalService();

  state = {
    choice: ["saints", null, "saints", null]
  };

  onChangeValue (side, group, id) {
    let changingChoice = this.state.choice;
    let i = side.charAt(0)==='o'? 0:2;
    changingChoice[i] = group;
    changingChoice[i+1] = id;
    this.setState({choice: changingChoice});
  }

  formSubmit = (event) => {
    event.preventDefault();
    window.location = `${this.stampsData._clientBase}search/${this.state.choice[0]}/${this.state.choice[1]}/${this.state.choice[2]}/${this.state.choice[3]}`;
  }

  render() {
    return (
      <form action='search' onSubmit={this.formSubmit}>
        <div className="obv-drop">
          <h5>Obverse |</h5>
          <SearchBand side="obv" onChange={(group, id) => this.onChangeValue ("obv", group, id) }/>
        </div>
        <div className="obv-drop">
          <h5>Reverse |</h5>
          <SearchBand side="rev" onChange={(group, id) => this.onChangeValue ("rev", group, id) }/>
        </div>

        <div className='main-button'>
          <button type="submit" className="btn btn-primary">Find</button>
        </div>
      </form>
    )
  }
}
