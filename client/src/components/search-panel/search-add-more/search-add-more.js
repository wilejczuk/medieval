import React, { Component }  from 'react';
import './search-add-more.css';

export default class SearchAddMore extends Component {
  render() {
    const {selection, queryData} = this.props;

    const query = (typeof queryData === "number") ?
      `${queryData}/null/null/null` :
      `${queryData['o']}/${queryData['od']}/${queryData['r']}/${queryData['rd']}`;

    const linkDrawing = `/type/add/${selection[0]}/${selection[1]}/${query}/drawing`;
    const linkImage = `/type/add/${selection[0]}/${selection[1]}/${query}/image`;

    const relevantView = selection[2]===0 ?
    (
      <div className="grid-element padding-top">
        Add new
        &nbsp;<span ><a href={linkDrawing}>with line drawings</a> or <a href={linkImage}>using just specimen image</a></span>
      </div>
    ) : (
      <div className="grid-element padding-top">
        Did not find the stamps' combination of the type "<b>{selection[0]} / {selection[1]}</b>"? <br />Add new
        &nbsp;<span ><a href={linkDrawing}>with line drawings</a> or <a href={linkImage}>using just specimen image</a></span>
      </div> 
    )

    return (
      relevantView
    )
  }
}
