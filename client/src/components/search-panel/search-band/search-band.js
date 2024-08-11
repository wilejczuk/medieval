import React, { Component }  from 'react';
import './search-band.css';
import InternalService from '../../../services/internal-api';
import SearchDetails from '../search-details';
import SearchOptions from '../search-options';

export default class SearchBand extends Component {
  stampsData = new InternalService();

  state = {
    saints: null,
    fullSaints: null,
    signs: null,
    crosses: null,
    letters: null,
    other: [{id: 1, text: "Portrait"}, {id: 2, text: "Rosette"}, {id: 3, text: "Anything else"}], // Заменить запросом из БД при усложнении
    currentSelection: "saints",
    filterText: "",
    subTypeChoise: null,
    selectedOptions: []
  };

  componentDidMount() {
    this.stampsData.getDictionaries()
      .then((body) => {
        this.setState({
          saints: body.data.saints.map(({id, name, epithet, name_en, epithet_en, subGroup}) => {
            return {id: id, text: `${name_en}, ${epithet_en} | ${name}, ${epithet}`, subGroup: subGroup}
          }),
          fullSaints: body.data.saints.map(({id, name, epithet, name_en, epithet_en, subGroup}) => {
            return {id: id, text: `${name_en}, ${epithet_en} | ${name}, ${epithet}`, subGroup: subGroup}
          }),
          signs: body.data.signs.map(({id, type, name}) => {
            return {id: id, text: `${this.stampsData._apiBase}signs/${id}.${type}`, subGroup: name}
          }),
          crosses: body.data.crosses.map(({id, type}) => {
            return {id: id, text: `${this.stampsData._apiBase}crosses/${id}.png`}
          }),
          letters: body.data.letters.map (({id, symbol}) => {
            return {id: id, text: symbol}
          })
        });
      });
  }

  selectItems(kind) {
    this.setState({ currentSelection: kind });
    this.props.onChange(kind, null, []);
    this.setState({ subTypeChoise: null, selectedOptions: [] });
    this.searchOptionsRef.resetAdvancedSearch();
  }

  handleCheckboxChange = (checkboxId) => {
    this.setState(prevState => ({
      selectedOptions: prevState.selectedOptions.includes(checkboxId)
        ? prevState.selectedOptions.filter(id => id !== checkboxId)
        : [...prevState.selectedOptions, checkboxId]
    }),
    () => {
      this.props.onChange(this.state.currentSelection, this.state.subTypeChoise, this.state.selectedOptions);
    });
  }

  render() {
    const {side, onChange} = this.props;

    const { saints, currentSelection } = this.state;

    if (!saints) {
      return (
        <h3>List of saints is empty.</h3>
      )
    }

    const handleInputChange = (e) => {
      const searchText = e.target.value;
      this.setState ({ filterText: searchText })
  
      const filteredSaints = this.state.fullSaints.filter((saint) =>
        saint.text.toLowerCase().includes(searchText.toLowerCase())
      );

      this.setState({saints: filteredSaints});
    };

    const handleClearClick = () => {
      this.setState({ filterText: '', saints: this.state.fullSaints });
    };

    const saintsSearch = currentSelection === "saints" ?
      (<div className='saint-filter'>
        <input
          type="text"
          placeholder="Search saints..."
          value={this.state.filterText}
          onChange={handleInputChange}
          maxLength={100}
        />
        <a
          className='show-all-link' 
          onClick={handleClearClick} 
          href="#"
        >
          Show All
        </a>
      </div> 
      ) : null;

    return (
      <div className="sides-panel">
        <h5 className='hid-on-small'>{side}erse |</h5>
          <div className="btn-group band" role="group" aria-label="Image Type">
            <button type="button" className="btn btn-secondary" onClick={() => this.selectItems("saints")}>Saint</button>
            <button type="button" className="btn btn-secondary" onClick={() => this.selectItems("letters")}>Lettering</button>
            <button type="button" className="btn btn-secondary" onClick={() => this.selectItems("signs")}>Tamgha</button>
            <button type="button" className="btn btn-secondary" onClick={() => this.selectItems("crosses")}>Cross</button>
            <button type="button" className="btn btn-secondary" onClick={() => this.selectItems("other")}>Other</button>
          </div>

            <SearchOptions  group = {currentSelection}
                            arr = {this.state[currentSelection=='saints'?'fullSaints':currentSelection]} 
                            subtype = {this.state.subTypeChoise}
                            ref={(ref) => (this.searchOptionsRef = ref)} 
                            onCheckboxChange={this.handleCheckboxChange}
            />

          {saintsSearch}

          <div className="type-content long-column left-element">
            <SearchDetails  side={side}
                            group={currentSelection}
                            arr={this.state[currentSelection]}
                            onChange={(group, id) =>{ this.setState({ subTypeChoise: id }); onChange(group, id, this.state.selectedOptions)}}
            />
          </div>
      </div>
    )
  }
}
