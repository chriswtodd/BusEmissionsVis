/**
 * @author Chris Todd, chriswilltodd@gmail.com
 * Github: chriswtodd
 */ 

import React, { useState } from 'react';
import styled from "styled-components";
import SideMenuVisualisation from "./sideMenuVisualisation.jsx";
import SideMenuVisualisationFilters from "./sideMenuVisualisationFilters.jsx"

import { FaDatabase, FaEye, FaTools, FaCog } from 'react-icons/fa';

let styles = require('../styles.js');

const MenuContainer = styled.div`
    transition: opacity 0.2s, width 0.2s;
    zIndex: 20000;
    display: flex;
    flex-direction: column;
    top: 0px; left: 0;
    width: auto;
    opacity: 1;
    backgroundColor: ${styles.side_menu_background};
    overflow-y: auto;
    overflow-x: hidden;
`;

const DB = styled(FaDatabase)`
transform: translate(calc(100% - 10px), 0);
`;
const Eye = styled(FaEye)`
transform: translate(calc(100% - 10px), 0);
`;
const Tool = styled(FaTools)`
transform: translate(calc(100% - 10px), 0);
`;
const Cog = styled(FaCog)`
transform: translate(calc(100% - 10px), 0);
`;

export default function SideMenuLeft() {
    return (
        <>
            <MenuContainer  style={{margin: "20px", gap: "20px"}}>                
                <SideMenuVisualisation />
                <SideMenuVisualisationFilters />
            </MenuContainer>
        </>
    )
}