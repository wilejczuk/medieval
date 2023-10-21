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
                However, many of them are illegible, and bring just a little useful information, so it is pretty important to collect pictures of multiple specimens to study them properly. Our database currently contains almost 3k seals in it.
              </div>
              <MapComponent />
              <Stats />
            </div>
          } />

          <Route path="/about" element={
            <div>
              <div className='padding-both bukvitsa indent'>
                The basic functionality of the system includes: <br/>
                <div className='indent'>1. A search by the name of issuers - princes, their wives, boyars and clergy. Each attribution is substantiated in some scientific publication. The system allows you to move along the family tree of princes, as well as look separately at representatives of certain dynastic branches e.g. <a href='./5'>Younger Monomashichi</a> or <a href='./1'>"Rogvolod's grandchildren"</a>. Likewise, you can review only the issuing <a href='./7'>Metropolitans</a>.<br/>
                </div> 
                <div className='indent'>2. Seals can be <a href='./search'>filtered</a> by main iconographic types - images of patron saints, inscriptions and individual letters, princely signs, crosses of various types, and others. It is possible to specify both strict search criteria and search by groups of images, e.g. <a href='./search/saints/7/letters/null'>the image of the Apostle Peter on one side and any letters or inscriptions on another</a>. No matter what side you consider the obverse - the system will find matches in <a href='./search/letters/null/saints/7'>both directions</a>. Numbers according to the classical catalogue of Valentin Yanin are given directly in the list of the search results.
                </div> 
                <div className='indent'>3. <a href='./type/189/190'>Inside the type</a>, one can find images of all specimens added to the database with indications of their publications, as well as a map of the finds. Functions of adding new specimens and attributions are available to <b>authorized</b> users. Want to get editorial access - individual or institutional? <a href='mailto:creators@kievan-rus.online'>Request from us</a>.
                </div> 
                <div className='indent'>4. The <a href='./stats'>global topography</a> of seals is presented on a separate page. Here you can view finds by settlement both as a list and directly on the map.<br/>
                </div> 
                <div className='indent'>The creation of a client-server application using modern technologies was made possible thanks to funding from the <a href='https://svensvenssonsstiftelse.se/'>Sven Svensson Foundation</a>. 
                </div> 
              </div>
              <div className='padding-both bukvitsa indent'> Technologies used: NodeJS, ExpressJS, React, MySQL.
              </div>
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
