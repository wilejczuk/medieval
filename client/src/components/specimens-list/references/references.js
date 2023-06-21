import React, { Component }  from 'react';
import './references.css';

export default class References extends Component {

  renderItems(arr) {
    return arr.map(({name, year, page, number}) => {
        if (!name) return;
        const longName = name.includes(', Unpublished,') ? (<span><span className='circle-info'>!</span> <span>Unpublished.</span></span>) : (<span><i>{year}</i> <span className="date">{name}</span> С. {page}, № {number}</span>);

        const uniqueKey = `${year}${page}${number}`;
        return (
          <div key={uniqueKey} className="paddington">
            {longName}
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
