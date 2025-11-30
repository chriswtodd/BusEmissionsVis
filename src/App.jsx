/**
 * @author Chris Todd, chriswilltodd@gmail.com
 * Github: chriswtodd
 */ 

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import { setPublicUrl, setApiUrl } from './redux/envVarsSlice.js';
import { useSelector, useDispatch } from 'react-redux';
import { setRoutes } from './redux/filterSlice';

import ProtectedRoute from './components/protectedRoute.tsx';

// Page components for router
import Home from './views/home.jsx';
import Visualisations from './views/visualisations.jsx';
import Login from './views/login.tsx';
import Register from './views/register.tsx';

import AuthProvider, { useAuth } from './components/authProvider.tsx';

let styles = require('./styles.js');

const authenticatedButtons = [
  {
    "label" : "Home", 
    "to": "/",
    "component" : Home
  },
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
  {
    "label" : "Logout",
    "to": "/logout",
    "component" : ""
  }
]

const nonAuthenticatedButtons = [
  {
    "label" : "Register", 
    "to": "/register",
    "component" : Register
  },
  {
    "label" : "Login", 
    "to": "/login",
    "component" : Login
  },
]
  
const Button = styled.button`
  font: 400 18px Roboto;
  zIndex: 1000;
  color: ${styles.text_colour};
  background: ${styles.background_colour};
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
  transition: ease backgroundColor 250ms;
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
    backgroundColor: rgba(255, 255, 255, 0.1);
  `}
`;

//Header styles
const Header = styled.div`
  height: ${styles.header_height};
  width: 100%;
  padding: 0px 10px;
  align-items: center;
  justify-content: left;
  zIndex: 1;
  position: relative;
  box-shadow: var(--container-shadow);
  background: transparent url(./imgs/banner.jpg);
  background-color: ${styles.background_colour};
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
  const [active, setActive] = useState(nonAuthenticatedButtons[0]);
  dispatch(setPublicUrl())
  dispatch(setApiUrl())
  const { user } = useAuth();
  console.log(user === undefined);

  const LoginButton = () => (
    <LinkUnstyled to={"/login"} key={"login"} >
      <ButtonToggle active={(active === "login").toString()} onClick={() => setActive("login")}>
        Login
      </ButtonToggle>
    </LinkUnstyled>
  )

  const LogoutButton = () => (
    <LinkUnstyled to={"/logout"} key={"logout"} >
      <ButtonToggle active={(active === "logout").toString()} onClick={() => setActive("logout")}>
        Logout
      </ButtonToggle>
    </LinkUnstyled>
  )
  
  let allButtons = authenticatedButtons.concat(nonAuthenticatedButtons);

  if (user === undefined)
  {
    allButtons = allButtons.filter(button => button.label !== "Logout")
  } 
  else 
  {
    allButtons = allButtons.filter(button => button.label !== "Login" && button.label !== "Register")
  }
  console.log(allButtons)
  //Set body
  componentWillMount();
  return (
    <Router>
      <MainFlex>
        <nav>
          <Header id='header' key='header' >
              {/* add all buttons to nav menu */}
              {allButtons.map((type) => (
                <LinkUnstyled to={type.to} key={type.label} >
                  <ButtonToggle active={(active === type.label).toString()} onClick={() => setActive(type.label)}>
                    {type.label}
                  </ButtonToggle>
                </LinkUnstyled>
              ))}
          </Header>
        </nav>
        <AuthProvider>
          <Routes>
            {authenticatedButtons.map((type) => (
              <Route path={type.to} key={type.label} exact element={<ProtectedRoute><type.component /></ProtectedRoute>} />
            ))}

            {nonAuthenticatedButtons.map((type) => (
              <Route path={type.to} key={type.label} exact element={<type.component />} />
            ))}
                
            <Route render={() => <h1>404: page not found</h1>} />

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