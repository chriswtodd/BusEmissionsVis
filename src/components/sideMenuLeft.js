/**
 * @author Chris Todd, chriswilltodd@gmail.com
 * Github: chriswtodd
 */ 

import React, { useState } from 'react';
import styled from "styled-components";
import ButtonFactory from "./sideMenuButton.js";
import SideMenuFilter from "./sideMenuFilters.js"

import { FaDatabase, FaEye, FaTools, FaCog } from 'react-icons/fa';

let styles = require('../styles.js');

const MenuContainer = styled.div`
    transition: opacity 0.2s, width 0.2s;
    z-index: 20000;
    display: flex;
    flex-direction: column;
    top: 0px; left: 0;
    width: auto;
    opacity: 1;
    background-color: ${styles.side_menu_background};
    overflow-y: auto;
    overflow-x: hidden;
`;

const MenuContainerToggle = styled(MenuContainer)`
    ${({closed}) =>
        closed &&
        `
        opacity: 0 !important;
        width: 0%;
        transition: width 0.5 linear;
        `
    }
`;

export const buttons = [
    {
        "label": "Visualisation",
        "entries": [
            {
                "label": "Stream Graph",
                "onClick": function() {

                }
            }, 
            {
                "label": "Line Chart",
                "onClick": function() {}
            }, 
            // {
            //     "label": "Heat Chart",
            //     "onClick": function() {}
            // }, 
            // {
            //     "label": "Bubble Chart"
            // }
        ]
    },
    // {
    //     "label": "Data",
    //     //Represents buttons within this menu
    //     "entries": [{"label": "Wellington"}, {"label": "Auckland"}, {"label": "Custom"}]
    // },
    // {
    //     "label": "Visualisation Tools",
    //     "entries": []
    // },
    // {
    //     "label": "Visualisation Options",
    //     "entries": []
    // },
]
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
    const [active, setActive] = useState("Visualisation");

    return (
        <>
            <MenuContainer>                
                {buttons.map((type) => (
                    <ButtonFactory active={active}
                        type={type} 
                        setActive={setActive}
                    >
                    </ButtonFactory>
                ))}
                <SideMenuFilter />
            </MenuContainer>
        </>
    )
}