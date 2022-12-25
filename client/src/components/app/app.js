import React, { Component } from 'react';
import { setAuthToken } from '../../helpers/set-auth-token';

import {
  BrowserRouter as Router, Routes, Route, Link
} from "react-router-dom";

import LoginForm from '../login-form';
import Personalia from '../personalia-list';
import PrivateRoute from "../route-guard"

export default class App extends Component {
  token = localStorage.getItem("token");
  if (token) {
      setAuthToken(token);
  }

  render() {
    return (
      <Router>
        <Routes>
          <Route exact path="/" element = {
            <PrivateRoute>
              <Personalia />
            </PrivateRoute>
          } />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/logout" element={<LoginForm />} />
        </Routes>
      </Router>
    );
  }
}
