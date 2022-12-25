import React from 'react';
import { Route, Navigate } from 'react-router-dom';

function PrivateRoute({ children }) {

  function hasJWT() {
      let flag = false;

      //check user has JWT token
      localStorage.getItem("token") ? flag=true : flag=false

      return flag;
  }

  const auth = hasJWT();
  return auth ? children : <Navigate to="/login" />;
}

export default PrivateRoute;
