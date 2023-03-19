import React, { Component }  from 'react';
import './search-details.css';

export default class SearchDetails extends Component {
  render() {
    const {side, arr, group} = this.props;

    if (group == "text")
      return (<div className="pseudo-text" id="obvText"></div>);

    return arr.map(({id, text}) => {
      const uniqueKey = side + id;
      const uniqueGroup = `${side}${group}`;
      const contents = text.startsWith('http') ?
          (<img height='50px' className="rounded" src={text} />) : text;
      return (
        <div id="radios" className=" radio-item paddington" key={uniqueKey}
                        onChange={() => this.props.onChange(group, id)}>
          <label className="form-check-label">
            <input className="form-check-input" type="radio" name={uniqueGroup} value={id} />
            <span>{contents}</span>
          </label>
        </div>
      );
    });
  }
}