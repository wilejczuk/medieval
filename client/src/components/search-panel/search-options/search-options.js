import React, { Component }  from 'react';
import './search-options.css';

export default class SearchOptions extends Component {
  state = {
    advancedSearch: false
  };

  toggleAdvancedSearch = () => {
    this.setState(prevState => ({
      advancedSearch: !prevState.advancedSearch
    }));
  };

  resetAdvancedSearch = () => {
    this.setState({ advancedSearch: false });
  }

  render() {
    const {subtype, arr, group, onCheckboxChange} = this.props;

    if (!["saints","signs", "other"].includes(group) ||
     (!subtype && ["saints","signs"].includes(group))) return null;

    let saintType;
    const recordWithId = arr.find(el => el.id === subtype);
    if (recordWithId) {
      const uncertainTextRecords = arr.filter(el =>
        el.subGroup === recordWithId.subGroup && el.text.includes('uncertain')
      );
      if (uncertainTextRecords.length > 0) {
        saintType = uncertainTextRecords[0].text.split(',')[0];
      }
    }

    /*
      Possible options:
        a) Everything - include every image
        b) Uncertain saints - for saints, where image is not attributed
        c) Uncertain saints within a group - for saints, where image is not attributed, but group is, e.g. uncertain warriors
        d) All saints of a group - for saints, all of the same group, e.g. all attributed warrior saints
        e) All signs of a group - for signs, all of the same group, e.g. all bell-shaped signs
    */

    let commonOption;
    switch (group) {
      case "saints": commonOption = (<span>
        <input type="checkbox" id="b" className="advanced-option"
          onChange={() => onCheckboxChange("b")} />
        <label htmlFor="b" className="advanced-option-label"> uncertain saints</label>
      </span>);
      break;
      case "signs": commonOption = (<span>
        <input type="checkbox" id="e" className="advanced-option"
          onChange={() => onCheckboxChange("e")} />
        <label htmlFor="e" className="advanced-option-label"> sign group</label>
      </span>);
      break;
      case "other": commonOption = (<span>
        <input type="checkbox" id="a" className="advanced-option"
          onChange={() => onCheckboxChange("a")} />
        <label htmlFor="a" className="advanced-option-label"> everything</label>
      </span>);  
      break;          
    }
    if (!subtype && ["saints","signs"].includes(group)) commonOption = null;

    let specificOptions = saintType ? 
          (<span className="advanced-option-span">
            <input type="checkbox" id="d" className="advanced-option"
              onChange={() => onCheckboxChange("d")} />
            <label htmlFor="d" className="advanced-option-label"> all {saintType.toLowerCase()}s</label>
            <input type="checkbox" id="c" className="advanced-option"
              onChange={() => onCheckboxChange("c")} />
            <label htmlFor="c" className="advanced-option-label"> uncertain {saintType.toLowerCase()}s</label>
          </span>) 
    : null;

    const arrowStyle = this.state.advancedSearch ? "arrow-down" : "arrow-right";
    const optionsHint = this.state.advancedSearch ? "Include also:" : "options";


    return (<div className='advanced-options'>
      <div>
        <span 
          onClick={this.toggleAdvancedSearch}
          className={arrowStyle}>
        </span>
        <sup className="options-hint"> {optionsHint}</sup>
      </div>
      <div>
        {this.state.advancedSearch && specificOptions}
        {this.state.advancedSearch && commonOption}
      </div> 
    </div>
    );
  }
}