import React, { Component }  from 'react';
import './references.css';

export default class References extends Component {

  renderItems(arr) {
    return arr.map(({name, year, page, number}) => {
        if (!name) return;

        return (
          <div className="paddington">
            <i>{year}</i> <span className="date">{name}</span> С. {page}, № {number}.
          </div>
        );
    });
  }

  render() {
    const {refs} = this.props;
    const items = this.renderItems(refs);

    return (
      <div>
        {items}
      </div>
    )
  }
}
