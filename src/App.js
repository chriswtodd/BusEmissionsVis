/**
 * @author Chris Todd, chriswilltodd@gmail.com
 * Github: chriswtodd
 */ 

import React, { useState } from "react";
import styled from "styled-components";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";

import { useSelector, useDispatch } from 'react-redux';
import { setUrl } from 'redux/envVarsSlice.js';

// Page components for router
import Home from './views/home.js';
import Visualisations from './views/visualisations.js';

import logo from './components/GW_Logo.png';
const Logo = styled.img`
  height: 45px;
  border-right: 1px solid rgba(255, 255, 255, 0.3);
  padding-left: 40px;
  padding-right: 105px;
`;

require('dotenv').config()
let styles = require('../src/styles.js');

const buttons = [
  {
    "label" : "Home", 
    "to": "/",
    "component" : Home
  },
  // {
  //   "label": "Tutorial - User Interface",
  //   "to": "/tut1",
  //   "component" : ""
  // },
  // {
  //   "label" : "Tutorial - Visualisations",
  //   "to": "/tut2",
  //   "component" : ""
  // },
  {
    "label" : "BEVFERLE Tool",
    "to": "/visualisations",
    "component" : Visualisations
  },
  // {
  //   "label" : "User Study",
  //   "to": "/tut1",
  //   "component" : ""
  // }
]
  
const Button = styled.button`
  font: 400 18px Roboto;
  z-index: 1000;
  color: ${styles.text_colour};
  background: ${styles.background_colour}
  padding: 0 0.6em;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: none;
  border-right: 1px solid rgba(255, 255, 255, 0.3);
  border-left: none;
  border-top: none;
  border-bottom: none;
  user-select: none;
  cursor: pointer;
  transition: ease background-color 250ms;
  &:hover {
    background: rgba(255, 255, 255, 0.164);
  }
  &:disabled {
    cursor: default;
    opacity: 0.9;
  }
  -webkit-writing-mode: none;
text-rendering: none;
letter-spacing: none;
word-spacing: none;
text-transform: none;
text-indent: none;
text-shadow: none;
`;

Button.defaultProps = {
  theme: "blue"
};

const ButtonToggle = styled(Button)`

  ${({ active }) =>
    active &&
    `
    opacity: 1;
    background-color: rgba(255, 255, 255, 0.1);
  `}
`;

//Header styles
const Header = styled.div`
  height: ${styles.header_height};
  width: 100%;
  padding: 0px 10px;
  align-items: center;
  justify-content: left;
  z-index: 1;
  position: relative;
  box-shadow: var(--container-shadow);
  background: transparent url(./imgs/banner.jpg);
  background-color: ${styles.background_colour}
  grid-column-start: 1;
  grid-column-end: 3;
  display: flex;
  flex-flow: row nowrap;
`;

//Remove underline
const LinkUnstyled = styled(Link)`
  text-decoration: none;
  height: 100%;
`;

const MainFlex = styled.main`
  display: flex;
  height: 100%;
  flex-direction: column;
`;

export default function App() {
  let dispatch = useDispatch();
  const [active, setActive] = useState(buttons[0]);
  dispatch(setUrl(window.location.href))
  //Set body
  componentWillMount();
  return (
    <Router>
      <MainFlex>
        <nav>
          <Header id='header' >
            <Logo src={logo} />
            {buttons.map((type) => (
              <LinkUnstyled to={type.to}>
                <ButtonToggle active={active === type.label} onClick={() => setActive(type.label)}>
                  {type.label}
                </ButtonToggle>
              </LinkUnstyled>
            ))}
          </Header>
        </nav>
        <Switch>
          {buttons.map((type) => (
            <Route path={type.to} exact component={type.component} />
          ))}
          
          <Route render={() => <h1>404: page not found</h1>} />

        </Switch>
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