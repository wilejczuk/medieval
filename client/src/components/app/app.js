import React, { Component } from 'react';
import { setAuthToken } from '../../helpers/set-auth-token';
import './app.css';

import {
  BrowserRouter as Router, Routes, Route, Link, useParams
} from "react-router-dom";

import LoginForm from '../login-form';
import Personalia from '../personalia-list';
import Stamps from '../stamps-list';
import PersonaliaNew from '../personalia-new';
import PrivateRoute from "../route-guard";
import AppHeader from "../app-header";
import Map from "../map";
import SearchPanel from '../search-panel';
import SearchBand from '../search-panel/search-band';

export default class App extends Component {
  token = localStorage.getItem("token");
  if (token) {
      setAuthToken(token);
  }

  render() {

    const StampsWrapper = (props) => {
      const params = useParams();
      return <Stamps {...{...props, match: {params}} } />
    }

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

          <Route path="/test" element={
            <div className='selection-interface'>
              <div className="obv-drop">
                <h5>Obverse |</h5>
                <SearchBand side="obv" />
              </div>
              <div className="obv-drop">
                <h5>Reverse |</h5>
                <SearchBand side="rev" />
              </div>
            </div>
          } />

          <Route path="/search/:o/:od/:r/:rd" element={
            <div className='selection-interface'>
              <SearchPanel />
              <StampsWrapper />
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
