import React, { Component }  from 'react';
import AddPublication from '../../type/add-publication'; 
import './references.css';

export default class References extends Component {

  state = {
    mode: ""
  };

  canAddPublication(auth) {
    if (auth && this.state.mode==="")
      return (
        <button className="btn btn-secondary" title="Add another specimen"
          onClick={()=>{
            this.setState({
              mode: "addPublication"
            });
          }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus" viewBox="0 0 16 16">
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"></path>
          </svg>
        </button>
      )
  }

  completeAdd() {
    this.props.onAdded();
    this.setState({
      mode: ""
    });
  }
  
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

    const { mode } = this.state;
    const addMore = this.canAddPublication(localStorage.getItem("token") ? true : false);

    const {refs} = this.props;
    const items = this.renderItems(refs);
    let addForm = null;

    switch (mode) {
      case "addPublication":
        addForm = 
          (<AddPublication 
            key="addPublicationKey"
            onAdded={() => this.completeAdd()}
            defaultValues = {[refs[0].id]} />);
        break;
      default:
        
    }

    return (
      <div>
        {items}
        {addMore}
        {addForm}
      </div>
    )
  }
}
