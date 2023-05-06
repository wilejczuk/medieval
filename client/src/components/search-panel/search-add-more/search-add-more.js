import React, { Component }  from 'react';
import './search-add-more.css';

export default class SearchAddMore extends Component {
  render() {
    const {selection, queryData} = this.props;

    const query = (typeof queryData === "number") ?
      `${queryData}/null/null/null` :
      `${queryData['o']}/${queryData['od']}/${queryData['r']}/${queryData['rd']}`;

    const link = `/type/add/${selection[0]}/${selection[1]}/${query}`;

    const relevantView = selection[2]===0 ?
    (
      <div className="grid-element padding-top">
        <span className="greyish"><a href={link}>Add new</a></span>
      </div>
    ) : (
      <div className="grid-element padding-top">
        Did not find the stamps' combination of the type<br /> <b>{selection[0]} / {selection[1]}</b>? <span className="greyish"><a href={link}>Add new</a></span>
      </div>
    )

    return (
      relevantView
    )
  }
}
