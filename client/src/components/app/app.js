import React, { Component } from 'react';
import { setAuthToken } from '../../helpers/set-auth-token';
import axios from 'axios';
import './app.css';

import {
  BrowserRouter as Router, Routes, Route, Link, useParams
} from "react-router-dom";

import LoginForm from '../login-form';
import Attribute from '../attribute'; 
import Stamps from '../stamps-list';
import PrivateRoute from "../route-guard";
import AppHeader from "../app-header";
import AppFooter from "../app-footer";
import MapComponent from "../map";
import SearchPanel from '../search-panel';
import Type from '../type';
import AddType from '../type/add-type';
import Location from '../location';
import Genealogy from '../genealogy';
import Paleography from '../paleography';
import ByPublication from '../bibliography';
import Publications from '../bibliography/publications';
import Intro from '../intro';
import About from '../about';
import Features from '../about/features';
import Person from '../person/person';

export default class App extends Component {
  token = localStorage.getItem("token");
  if (token) {
      setAuthToken(token);
  }

  state = {
    loggedUser: localStorage.getItem("user")?localStorage.getItem("user"):"visitor"
  };

  componentDidMount() {
    setInterval(() => {
      //API queried to prevent falling asleep
      axios.get(`https://server.kievan-rus.online/dukes`);
    }, 300000);     
  }

  render() {
    const StampsWrapper = (props) => {
      const params = useParams();
      return <Stamps {...{...props, match: {params}} } />
    }

    const TypesWrapper = (props) => {
      const params = useParams();
      return <Type {...{...props, match: {params}} } />
    }

    const LocationWrapper = (props) => {
      const params = useParams();
      return <Location {...{...props, match: {params}} } />
    }

    const PublicationWrapper = (props) => {
      const params = useParams();
      return <ByPublication {...{...props, match: {params}} } />
    }

    const AddTypesWrapper = (props) => {
      const params = useParams();
      return <AddType {...{...props, match: {params}} } />
    }

    const PersonWrapper = (props) => {
      const params = useParams();
      return <Person {...{...props, match: {params}} } />
    }

    const IntroWrapper = (props) => {
      const params = useParams();
      return <Intro {...{...props, match: {params}} } />
    }

    return (
      <Router>
      <AppHeader loggedUser={this.state.loggedUser} />
        <Routes>
        <Route path="/" element={
            <div >
              <Intro />
            </div>
          } />
          <Route path="/:br" element={
            <div>
              <IntroWrapper />
            </div>
          } />

          <Route path="/stats" element={
            <div>
              <div className='padding-both bukvitsa'>
                The estimated number of seals of Kievan Rus’ published with their photos and some metrological data is more than 10k.<br /> 
                However, many of them are illegible and bring little useful information, so it is important to collect pictures of multiple specimens to study them properly. <br /> 
                Our database currently contains 6k+ seals, and we are planning to develop it further adding all published seals and enhancing functionality.
              </div>
              <MapComponent />
            </div>
          } />

          <Route path="/publications" element={
            <div>
              <Publications />
            </div>
          } />

          <Route path="/about" element={
            <div>
              <About />
            </div>
          } />

          <Route path="/features" element={
            <div>
              <Features />
            </div>
          } />

          <Route path="/type/:o/:r" element={
            <div>
              <TypesWrapper />
            </div>
          } />

          <Route path="/type/:o/:r/:s" element={
            <div>
              <TypesWrapper />
            </div>
          } />

          <Route path="/location/:geo" element={
            <div>
              <LocationWrapper />
            </div>
          } />

          <Route path="/publication/:id" element={
            <div>
              <PublicationWrapper />
            </div>
          } />

          <Route path="/type/add/:o/:r/:ot/:oi/:rt/:ri/:kind" element={
            <div>
              <AddTypesWrapper />
            </div>
          } />

          <Route path="/search" element={
            <div className='selection-interface'>
              <SearchPanel />
              <StampsWrapper />
            </div>
          } />

          <Route path="/search/:o/:od/:r/:rd" element={
            <div className='selection-interface'>
              <SearchPanel />
              <StampsWrapper />
            </div>
          } />

          <Route path="/person/:id" element={
            <div className='selection-interface'>
              <PersonWrapper />
              <StampsWrapper />
            </div>
          } />

          <Route path="/attribute" element={
            <div>
              <Attribute />
            </div>
          } />

          <Route path="/genealogy" element={
            <div>
              <Genealogy />
            </div>
          } />

          <Route path="/paleography" element={
            <div>
              <Paleography />
            </div>
          } />

          <Route path="/login" element={<LoginForm onLogin={
            (loggedUser)=> {
              this.setState({loggedUser: loggedUser});
          }
            } />} />
          <Route path="/logout" element={<LoginForm onLogin={(loggedUser)=> {this.setState({loggedUser: loggedUser})}} />} />
        </Routes>
        <AppFooter />
      </Router>
    );
  }
}
