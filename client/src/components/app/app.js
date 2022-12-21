import React, { Component } from 'react';
import {
  BrowserRouter as Router, Routes, Route, Link
} from "react-router-dom";

import LoginForm from '../login-form';

export default class App extends Component {
  render() {
    return (
      <Router>
        <Routes>
          <Route path="/" element = {
            <span><h1>Great app</h1><div><Link to="/login">Goto login</Link></div></span>
          } />
          <Route path="/login" element={<LoginForm />} />
        </Routes>
      </Router>
    );
  }
}
