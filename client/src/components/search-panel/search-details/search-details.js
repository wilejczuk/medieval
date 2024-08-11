import React, { Component }  from 'react';
import './search-details.css';

export default class SearchDetails extends Component {
  render() {
    const {side, arr, group} = this.props;

    let groupCaption = '';  

    return arr.map(({id, text, subGroup}) => {
      const uniqueKey = side + id;
      const uniqueGroup = `${side}${group}`;
      const contents = text.startsWith('http') ?
          (<img height='50px' className="rounded" src={text} />) : text;
          
      const indefinite = text.includes('неопределенный') ? 'italic' : 'normal';
      const coloring = subGroup ? 
       {
        color: `hsl(${(subGroup-36)*60}, 30%, 60%)`,
        fontStyle: `${indefinite}`
      }
       : null;

      let signGroup;

      if ((groupCaption === '' || groupCaption !== subGroup) && group === 'signs') {
        groupCaption = subGroup;
        signGroup = <div className='smaller'>{groupCaption}</div>;
      }
      else signGroup = null;

      return (
        <div id="radios" className="radio-item paddington" key={uniqueKey}
                        onChange={() => this.props.onChange(group, id)}>
          {signGroup}
          <label className="form-check-label">
            <input className="form-check-input" type="radio" name={uniqueGroup} value={id} />
            <span style={coloring}>{contents}</span>
          </label>
        </div>
      );
    });
  }
}