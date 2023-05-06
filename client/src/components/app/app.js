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
import Stats from '../stats';
import Intro from '../intro';import Person from '../person/person';

export default class App extends Component {
  token = localStorage.getItem("token");
  if (token) {
      setAuthToken(token);
  }

  state = {
    loggedUser: localStorage.getItem("user")?localStorage.getItem("user"):"visitor"
  };

  componentDidMount() {
    /* Redirect to the attribution page in Russian if needed
    axios
      .get("https://ipapi.co/json/")
      .then((response) => {
        if (["Russia", "Belarus", "Ukraine", "Moldova"].includes(response.data.country_name) &&
          window.location.pathname===`/` && !this.token) 
            window.location.replace(`/attribute`);
      })
      .catch((error) => {
        console.log(error);
      });
    */  
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
                The estimated number of the published seals of the Kievan Rus’ period is more than 10k.<br /> 
                However, many of them are illegible, and bring just a little useful information. Our database currently contains almost 200 seals in it, our goal is to have at least 3k listed by the end of 2023.
              </div>
              <MapComponent />
              <Stats />
            </div>
          } />

          <Route path="/type/:o/:r" element={
            <div>
              <TypesWrapper />
            </div>
          } />

          <Route path="/location/:geo" element={
            <div>
              <LocationWrapper />
            </div>
          } />

          <Route path="/type/add/:o/:r/:ot/:oi/:rt/:ri" element={
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
