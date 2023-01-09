import React, { Component } from 'react';
import { setAuthToken } from '../../helpers/set-auth-token';
import './app.css';

import {
  BrowserRouter as Router, Routes, Route, Link
} from "react-router-dom";

import LoginForm from '../login-form';
import Personalia from '../personalia-list';
import Stamps from '../stamps-list';
import PersonaliaNew from '../personalia-new';
import PrivateRoute from "../route-guard";
import AppHeader from "../app-header";
import Map from "../map";
import SearchPanel from '../search-panel';

export default class App extends Component {
  token = localStorage.getItem("token");
  if (token) {
      setAuthToken(token);
  }

  render() {
    return (
      <Router>
      <AppHeader />
        <Routes>
          <Route path="/" element={
            <div className='selection-interface'>
              <SearchPanel />
              <Map />
            </div>
          } />

          <Route path="/search" element={
            <div className='selection-interface'>
              <SearchPanel />
              <Stamps />
            </div>
          } />
          <Route exact path="/personalia/add" element = {
            <PrivateRoute>
              <PersonaliaNew />
            </PrivateRoute>
          } />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/logout" element={<LoginForm />} />
        </Routes>
      </Router>
    );
  }
}
