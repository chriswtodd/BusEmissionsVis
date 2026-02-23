/**
 * @author Chris Todd, chriswilltodd@gmail.com
 * Github: chriswtodd
 */ 

import React from "react";
import styled from "styled-components";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { setPublicUrl, setApiPrefix } from './redux/envVarsSlice.js';
import { useDispatch } from 'react-redux';

import ProtectedRoute from './components/protectedRoute.tsx';

import Home from './views/home.jsx';
import Visualisations from './views/visualisations.jsx';
import { GlobalHeader } from "./components/globalHeader.js";

import AuthProvider from './components/authProvider.tsx';

let styles = require('./styles.js');

const unauthenticatedButtons = [
  {
    "label" : "Home", 
    "to": "/",
    "component" : Home
  },
]

const authenticatedButtons = [
  {
    "label" : "BEVFERLE Tool",
    "to": "/visualisations",
    "component" : Visualisations
  }
]

const MainFlex = styled.main`
  display: flex;
  height: 100%;
  flex-direction: column;
`;

export default function App() {
  let dispatch = useDispatch();
  
  dispatch(setPublicUrl())
  dispatch(setApiPrefix())

  //Set body
  componentWillMount();
  return (
    <Router>
      <MainFlex>
        <GlobalHeader />
        <AuthProvider>
          <Routes>
            {authenticatedButtons.map((type) => (
              <Route path={type.to} key={type.label} exact element={<ProtectedRoute><type.component /></ProtectedRoute>} />
            ))}

            {unauthenticatedButtons.map((type) => (
              <Route path={type.to} key={type.label} exact element={<type.component />} />
            ))}
                
            <Route component={() => <h1>404: page not found</h1>} />

          </Routes>
        </AuthProvider>
      </MainFlex>
    </Router>
  );
}

//Apply body styles
let componentWillMount = function () {
  for (let i in styles.body) {
    document.body.style[i] = styles.body[i];
  }
}