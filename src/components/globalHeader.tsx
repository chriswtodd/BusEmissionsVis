import { useState, useEffect } from "react";
import { useLocation } from 'react-router';
import { useDispatch } from 'react-redux';
import styled from "styled-components";
import { Link } from "react-router-dom";

import Home from '../views/home.jsx';
import Visualisations from '../views/visualisations.jsx';

import { GoogleLogin } from "./googleLogin.js";
import { Notification } from "./notification.js";

import { setVisible, setMessage } from '../redux/notificationSlice.js';

let styles = require('../styles.js');

const LinkUnstyled = styled(Link)`
  text-decoration: none;
  height: 100%;
`;

const Header = styled.div`
  height: ${styles.header_height};
  width: 100%;
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

const Button = styled.button`
  font-weight: 400;
  font-size:  18px;
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
    backgroundColor: rgba(255, 255, 255, 0.1);
  `}
`;

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

export function GlobalHeader()
{
  const dispatch = useDispatch();
  const [active, setActive] = useState(authenticatedButtons[0]);
  const allButtons = unauthenticatedButtons.concat(authenticatedButtons);

  const { state } = useLocation();
  useEffect(() => {
    if (state?.authFailure)
    {
      dispatch(setVisible(true));
      dispatch(setMessage("You must be logged in to go there."));
    }
  }, [state])
    
  return (
      <div>
        <nav>
          <Header id='header' key='header' >
              {allButtons.map((type) => (
                  <LinkUnstyled to={type.to} key={type.label} >
                  <ButtonToggle active={(active.label === type.label).toString()} onClick={() => setActive(type)}>
                      {type.label}
                  </ButtonToggle>
                  </LinkUnstyled>
              ))}
              <GoogleLogin />
          </Header>
        </nav>
        <Notification />
      </div>
  )
}