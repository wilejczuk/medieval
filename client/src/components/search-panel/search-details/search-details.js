import React, { Component }  from 'react';
import './search-details.css';

export default class SearchDetails extends Component {
  onChangeValue = (event) => {
    let changingChoice = this.state.choice;
    event.target.name.charAt(0)==='o'?
      changingChoice[1] = parseInt(event.target.value, 10):
      changingChoice[3] = parseInt(event.target.value, 10);
    this.setState({choice: changingChoice});
  }

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
        <div className="form-check radio-item paddington" key={uniqueKey}
                        onChange={() => this.props.onChange(group, id)}>
          <input className="form-check-input" type="radio" name={uniqueGroup} value={id} />
          <label className="form-check-label">
            {contents}
          </label>
        </div>
      );
    });
  }
}
