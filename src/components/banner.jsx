/**
 * @author Chris Todd, chriswilltodd@gmail.com
 * Github: chriswtodd
 */ 

import React from 'react';
import styled from "styled-components";
import { useSelector } from 'react-redux';

let styles = require('../styles.js');

const BannerContainer = styled.div`
    font: 400 18px Roboto;
    zIndex: 1000;
    color: ${styles.text_colour};
    background-image: ${styles.banner_background};
    width: 100%;
    height: auto;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    flex-wrap: nowrap;
    color: #e7f3e7;
    text-align: center;
    padding: 0px 0px 10px 0px;
`;

const BannerTitle = styled.h1`
    margin: 20px 10px 10px 10px;
    font-size: 4em;
    fontWeight: 300;
    user-select: none;
    color: ${styles.text_colour};
    -webkit-text-stroke-width: .25px;
    -webkit-text-stroke-color: black;
`;

const BannerSubtitle = styled.div`
    margin: 10px 10px 20px 10px;
    font-size: 1.5em;
    fontWeight: 300;
    user-select: none;
    color: ${styles.text_colour};
    -webkit-text-stroke-width: .1px;
    -webkit-text-stroke-color: black;
`;

const BannerImg = styled.img`
    height: calc(90% - 80px);
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.5);
    border-radius: 15px;
`;

const BannerButton = styled.button`
    cursor: pointer;
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
    -webkit-box-shadow: 0px 0px 5px 2px rgba(0,0,0,0.75);
    -moz-box-shadow: 0px 0px 5px 2px rgba(0,0,0,0.75);
    box-shadow: 0px 0px 5px 2px rgba(0,0,0,0.75);
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

export default function Banner() {
    const url = useSelector(state => state.envVars.publicUrl);
    return (
        <BannerContainer >
            <div>
                <BannerTitle>
                    BEVFERLE - Bus Emissions Visualiser for Emissions Research of Local Emissions
                </BannerTitle>
                <BannerSubtitle>
                    Visualising Public Transport Data from New Zealand
                </BannerSubtitle>
                <BannerButton onClick={() => window.open(`${url}/visualisations`, '_blank')}>
                    Try BEFVERLE
                </BannerButton>
            </div>
        </BannerContainer>
    )
}