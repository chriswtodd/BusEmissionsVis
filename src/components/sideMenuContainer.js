/**
 * @author Chris Todd, chriswilltodd@gmail.com
 * Github: chriswtodd
 */ 

import React, { useState } from 'react';
import styled from "styled-components";
import { IoIosArrowForward } from 'react-icons/io';

let styles = require('../styles.js');

const Header = styled.div`
  height: 50px;
  width: 100%;
  text-align: left;
  float: left;
`;

const Container = styled.div`
    font: 400 18px Roboto;
    z-index: 1000;
    color: ${styles.text_colour};
    background: ${styles.background_colour}
    width: ${styles.side_menu_width};
    height: 50px;
    justify-content: center;
    align-items: center;
    padding: 0;
    display: flex;
    flex-direction: column;
    box-shadow: none;
    border-right: 1px solid rgba(255, 255, 255, 0.3);
    border-left: none;
    border-top: 1px solid rgba(255, 255, 255, 0.3);
    border-bottom: 1px solid rgba(255, 255, 255, 0.3);
    user-select: none;
    cursor: pointer;
    transition: ease all 250ms;
    &:hover {
        background: rgba(0, 120, 138, 0.7);
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

Container.defaultProps = {
  theme: "blue"
};

//Set button to change colour on active change
const MenuContainerToggle = styled(Container)`
  ${({ active }) =>
    active &&
    `
    height: auto;
    opacity: 1;
  `}
`;

const MenuBody = styled.div`
    background: white;
    height: 0px;
    width: 100%;
    transition: all ease 0.2s;
    display: hidden;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    opacity: 0;
    color: ${styles.text_colour_neg};
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
            <Header onClick={() => setActive(!active)}>
                {props.label}
                <ContainerArrowToggle active={active} />
            </Header>
            <MenuBodyToggle active={active}>
                {getChildren()}
            </MenuBodyToggle>
        </MenuContainerToggle>
    )
}