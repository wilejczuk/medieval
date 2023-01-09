import React, { Component }  from 'react';

export default class LogOut extends Component {
  render() {
    return (
      <div>You are logged in.
        <form><button formAction="/logout">Log out</button></form>
      </div>
    )
  }
}
