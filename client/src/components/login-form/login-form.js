import React, { Component }  from 'react';
import InternalService from '../../services/internal-api';
import { setAuthToken } from '../../helpers/set-auth-token';

export default class LoginForm extends Component {

  constructor() {
    super();
    setAuthToken(null);
    localStorage.removeItem("token");
  }

  state = {
    username: '',
    password: ''
  };

  onInputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  onSubmit = (e) => {
    e.preventDefault();
    authenticate('loginNew', this.state.username, this.state.password);
  };

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <div>
          <h1>Login</h1>
          <div>
            <label>Username: </label>
            <input type="text" placeholder="Enter Username" name="username" required onChange={this.onInputChange} />
          </div>
          <div>
            <label>Password: </label>
            <input type="password" placeholder="Enter Password" name="password" required onChange={this.onInputChange} />
          </div>

          <div>
            <button formAction="/login">Login</button>
          </div>
        </div>
      </form>
    )
  }
}

const authenticate = (url, username, password) => {
  const neededData = new InternalService();
  neededData.getAuthentication(url, username, password)
    .then(response => {
      console.log(response.data.token);
      //get token from response
      const token  =  response.data.token;

      //set JWT token to local
      localStorage.setItem("token", token);

      //set token to axios common header
      setAuthToken(token);

      //redirect user to home page
      window.location.href = '/'
    })
    .catch(error => console.log(error));
}
