/**
 * @author Chris Todd, chriswilltodd@gmail.com
 * Github: chriswtodd
 */ 

import React from 'react';
import styled from "styled-components";

let styles = require('../styles.js');

const ActionsContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    margin: 5% 18%;
`;

const ActionsButton = styled.button`
    box-sizing: content-box;
    width: 30%;
    height: 2em;
    padding: 10px;
    transition: backgroundColor 0.1s ease-in-out;
    background-image: ${styles.banner_background};
    color: #E0F7FA;
    border-radius: 10px;
    border: none;
    font-size: 1.2em;
    cursor: pointer;
    transition: all ease .5s;
    &:hover {
        transition: all ease .5s;
        transform: translate(0px,-2px);
        -webkit-box-shadow: 0px 1px 7px 2px rgba(0,0,0,0.75);
    }
    &:active {
        transition: all ease .1s;
        transform: translate(0px,0px);
        -webkit-box-shadow: 0px 0px 2px 0px rgba(0,0,0,0.75);
    }
`;

export default function Actions (props) {

      return (
        <ActionsContainer >
            <ActionsButton onClick={() => window.open('https://bevferle.herokuapp.com/visualisations', '_blank')}>
                Try BEFVERLE
            </ActionsButton>
        </ActionsContainer>
      )
}