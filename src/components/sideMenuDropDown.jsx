/**
 * @author Chris Todd, chriswilltodd@gmail.com
 * Github: chriswtodd
 */ 

import React, { useState } from 'react';
import { useSelector, useDispatch, connect } from 'react-redux';
import { setWindowRenderComponent, addWindow } from '../redux/windowSlice.js';

import styled from "styled-components";

import { buttons } from './sideMenuLeft.jsx';

let styles = require('../styles.js');

const Container = styled.div`
    zIndex: -1;
    display: flex;
    flex-direction: column;
    top: 0px; left: 0;
    backgroundColor: ${styles.side_menu_background};
    height: 0;
    width: ${styles.side_menu_width};
    opacity: 0;
    transition: ease all 250ms;
    cursor: default;
`;

//Set button to change colour on active change
const ContainerToggle = styled(Container)`
  ${({ open }) =>
    open &&
    `
    height: auto;
    opacity: 1;
  `}
`;

const DropDownButton = styled.button`
    font: 400 18px Roboto;
    zIndex: 1000;
    color: ${styles.side_menu_text};
    padding: 0 0.6em;
    height: 0px;
    display: flex;
    margin: 5px;
    opacity: 1;
    justify-content: left;
    align-items: center;
    box-shadow: none;
    border-radius: 25px;
    border: 1px solid ${styles.background_colour};
    user-select: none;
    cursor: pointer;
    transition: ease all 250ms;
    backgroundColor: rgba(255, 255, 255, 0.1);
    &:hover {
        background: ${styles.background_colour};
        color: ${styles.text_colour};
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

DropDownButton.defaultProps = {
  theme: "blue"
};

//Set button to change colour on active change
const DropDownButtonToggle = styled(DropDownButton)`
  ${({ active }) =>
    active &&
    `
    opacity: 1;
    background: ${styles.background_colour}
    color: ${styles.text_colour};
  `}
  ${({ open }) =>
    open &&
    `
    height: auto;
    opacity: 1;
  `}
`;

const SectionSeparator = styled.div`
  width: 100%;
  color: ${styles.text_colour_neg};
  border-bottom: 1px solid ${styles.background_colour};
  fontWeight: bold;
  padding: 5px;
`;

function DropDownButtonFactory (props) {
  let dispatch = useDispatch();

  return (
    <DropDownButtonToggle
      key={props.type.label}
      active={(props.active === props.type.label)}
      open={props.open}
      onClick={(e) => {
        props.setActive(props.type.label)
        dispatch(setWindowRenderComponent(e.target.innerHTML));
      }
      }>
      {props.type.label}
    </DropDownButtonToggle>
  )
}

function PopulateItems(props) {
  const [active, setActive] = useState(props.active);
    let button = buttons.filter(button => button.label === props.open);
    if ( button.length != 0 ) {
        return button[0].entries.map((e) => (
            <DropDownButtonFactory 
              id={e.label}
              key={e.label}
              active={active.toString()} 
              type={e} 
              setActive={setActive} 
              open={props.open}
            >
            </DropDownButtonFactory>
        ));
    }
    return <div key={"side-menu-dropdown_empty-list"}></div>;
}
const mapStateToProps = (state) => {
  {
    return {
      active: state.windows.windowRenderComponent
    }
  }
}
let Pop = connect(mapStateToProps)(PopulateItems);

export default class SideMenuDropDown extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <ContainerToggle 
          open={this.props.open === this.props.type.label}
          key={"div_container-toggle"}
        >
            <SectionSeparator id={"label_select-a-visualisation"} key={"label_select-a-visualisation"}>
              Select a visualisation:
            </SectionSeparator>
            <Pop
              id={"item-populator"}
              key={"item-populator"}
              open={this.props.open} 
              active={this.props.active.toString()} 
              setActive={this.props.setActive} 
            />
        </ContainerToggle>
    )
  }
}