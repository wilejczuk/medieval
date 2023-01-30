import React, { Component }  from 'react';
import { setAuthToken } from '../../helpers/set-auth-token';

export default class LogOut extends Component {

  formSubmit = (event) => {
    event.preventDefault();
    setAuthToken(null);
    localStorage.removeItem("token");
    window.location = '/';
  }

  render() {
    return (
      <div>By the way, you are logged in and can contribute.
        <form onSubmit={this.formSubmit}><button>Log out</button></form>
      </div>
    )
  }
}
