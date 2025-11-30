/**
 * @author Chris Todd, chriswilltodd@gmail.com
 * Github: chriswtodd
 */ 

import React, { useState } from 'react';
import styled from "styled-components";
import { useDispatch } from 'react-redux';
import { setWindowRenderComponent } from '../redux/windowSlice.js';
import RadioButtonGroup from "./radioButtonGroup.tsx";
import SideMenuContainer from "./sideMenuContainer.jsx";
import { GraphType } from "../common/constants.js"

let styles = require('../styles.js');

const Container = styled.div`
  background: rgba(255, 255, 255, 1);
  font: 400 18px Roboto;
  zIndex: 1000;
  color: ${styles.text_colour_negative};
  width: ${styles.side_menu_width};
  height: inherit;
  justify-content: center;
  align-items: center;
  padding: 0;
  display: none;
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

const CollapsableContainer = styled(Container)`
  ${({ active }) =>
    active &&
    `
      height: auto;
      display: flex;
      opacity: 1;
  `}
`;

export default function SideMenuVisualistion (props) {
  let [active, setActive] = useState(true);

  let dispatch = useDispatch();

  const [chartType, setChartType] = useState(GraphType.STREAM);

  return (
    <SideMenuContainer label={"Visualisations"} >
      <CollapsableContainer 
        id={"checkbox_visualisation-types"}
        active={active}
      >
        <RadioButtonGroup
          options={{[GraphType.LINE]: GraphType.LINE, [GraphType.STREAM]: GraphType.STREAM}}
          name="chartType"
          onChange={
              (checkedValue) => {
                setChartType(checkedValue)
                dispatch(setWindowRenderComponent(checkedValue));
              }
          }
          value={chartType}
        />
      </CollapsableContainer>
    </SideMenuContainer>
  )
}