/**
 * @author Chris Todd, chriswilltodd@gmail.com
 * Github: chriswtodd
 */ 

import React, { useState } from 'react';
import styled from "styled-components";
import { IoIosArrowForward } from 'react-icons/io';

let styles = require('../styles.js');

const Header = styled.div`
  background: rgba(0, 120, 138, 1);
  display: flex;
  align-items: center;
  height: 50px;
  width: 100%;
  text-align: left;
  float: left;
  justify-content: space-around;
  color: ${styles.text_colour};
  border-radius: 5px;
  transition: all ease 0.2s;
  flex-direction: row;
  display: flex;
  &:hover {
    background: rgba(255, 255, 255, 0.164);
  }
`;

const HeaderToggle = styled(Header)`
  ${({ active }) =>
    active &&
    `
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
  `}
`;

const Container = styled.div`
  background: rgba(0, 120, 138, 1);
  font: 400 18px Roboto;
  zIndex: 1000;
  color: ${styles.text_colour};
  width: ${styles.side_menu_width};
  height: auto;
  justify-content: center;
  align-items: center;
  padding: 0;
  display: flex;
  flex-direction: column;
  border: 1px rgba(0,0,0,0.4) solid;
  box-shadow: -6px 7px 4px 0px ${styles.window_background_colour};
  border-radius: 5px;
  user-select: none;
  cursor: pointer;
  transition: ease all 250ms;
  &:disabled {
    cursor: default;
    opacity: 0.9;
  }
  &:last-child {
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
  }
  -webkit-writing-mode: none;
  text-rendering: none;
  letter-spacing: none;
  word-spacing: none;
  text-transform: none;
  text-indent: none;
  text-shadow: none;
`;

const MenuContainerToggle = styled(Container)`
  ${({ active }) =>
    active &&
    `
    height: auto;
    opacity: 1;
  `}
`;

const MenuBody = styled.div`
  height: 0px;
  width: 100%;
  display: none;
  transition: all ease 0.2s;
  display: hidden;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  opacity: 0;
  color: ${styles.text_colour_neg};
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  &:last-child {
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
  }
  transition-behavior: allow-discrete;
  max-height: 500px;
`;

//Set container to hide on active change
const MenuBodyToggle = styled(MenuBody)`
  ${({ active }) =>
    active &&
    `
    height: auto;
    opacity: 1;
    display: flex;
  `}
`;

//Container arrow
const ContainerArrow = styled(IoIosArrowForward)`
    transform: translate(calc(100% - 10px), 0);
`;
const ContainerArrowToggle = styled(ContainerArrow)`
  ${({active}) =>
    active &&
    `
    transform: rotate(90deg);
  `}
`;

export default function SideMenuContainer (props) {
    let [active, setActive] = useState(true);

    function getChildren() {
        return props.children;
    }

    return (
        <MenuContainerToggle active={active} >
            <HeaderToggle onClick={() => setActive(!active)} active={active}>
                {props.label}
                <ContainerArrowToggle active={active} />
            </HeaderToggle>
            <MenuBodyToggle active={active}>
                {getChildren()}
            </MenuBodyToggle>
        </MenuContainerToggle>
    )
}