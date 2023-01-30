import React, { Component }  from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { setAuthToken } from '../../helpers/set-auth-token';
import InternalService from '../../services/internal-api';
import LogOut from '../log-out';
import './intro.css';

export default class Intro extends Component {

  constructor() {
    super();
    //setAuthToken(null);
    //localStorage.removeItem("token");
  }

  hasJWT() {
      let flag = false;
      localStorage.getItem("token") ? flag=true : flag=false
      return flag;
  }

  renderLoginOrLogout(auth) {
    if (auth) return (<LogOut />);
    else return (
          <div>
            <div className="padding-bottom">You need to log in to contribute (e.g., add new types and specimens).<br />
            There's no registration process. Email the admin if you want to contribute.</div>
            <Formik
               initialValues={{ email: '', password: '' }}
               validate={values => {
                 const errors = {};
                 if (!values.email) {
                   errors.email = 'Required';
                 } else if (
                   !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                 ) {
                   errors.email = 'Invalid email address';
                 }
                 return errors;
               }}
               onSubmit={(values, { setSubmitting }) => {
                 setTimeout(() => {
                   authenticate('loginNew', values.email, values.password);
                   setSubmitting(false);
                 }, 400);
               }}
             >
               {({ isSubmitting }) => (
                 <Form className="form-login">
                   <Field type="email" name="email" />
                   <ErrorMessage name="email" component="div" />
                   <Field type="password" name="password" />
                   <ErrorMessage name="password" component="div" />
                   <button type="submit" disabled={isSubmitting}>
                     Submit
                   </button>
                 </Form>
               )}
             </Formik>
          </div>
        )
  }

  render() {
    const needLogin = this.renderLoginOrLogout(this.hasJWT());

    return (
      <div className="padding-left">
        <p>Welcome to the seals database! You can <a href="/search">search it</a> or select items on the map aside.</p>
        {needLogin}
      </div>
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
