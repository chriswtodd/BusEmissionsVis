/**
 * @author Chris Todd, chriswilltodd@gmail.com
 * Github: chriswtodd
 */ 

import React from 'react';
import styled from "styled-components";
import SideMenuDropDown from "../components/sideMenuDropDown.js";
import { IoIosArrowForward } from 'react-icons/io';

let styles = require('../styles.js');

const Button = styled.button`
    font: 400 18px Roboto;
    z-index: 1000;
    color: ${styles.text_colour};
    background: ${styles.background_colour}
    width: ${styles.side_menu_width};
    height: 50px;
    justify-content: left;
    align-items: center;
    padding: 0;
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

Button.defaultProps = {
  theme: "blue"
};

//Set button to change colour on active change
const MenuButtonToggle = styled(Button)`
  ${({ active }) =>
    active &&
    `
    height: auto;
    opacity: 1;
  `}
`;

//Button arrow
const ButtonArrow = styled(IoIosArrowForward)`
    transform: translate(calc(100% - 10px), 0);
`;
const ButtonArrowToggle = styled(ButtonArrow)`
  ${({active}) =>
    active &&
    `
    transform: rotate(90deg);
  `}
`;

const Header = styled.div`
  height: 50px;
  text-align: left;
  float: left;
`;

//Turn buttons off too
function setActive(component) {
  if (component.props.active === component.props.type.label) {
    return component.props.setActive(0);
  }
  component.setState({
    dropdownTitle: component.props.type.label
  });
  return component.props.setActive(component.props.type.label);
}

export default class ButtonFactory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownTitle: "",
    }; 
  }

  render() {
      return (
        <>
        <MenuButtonToggle
          active={this.props.active === this.props.type.label} 
          onClick={() => setActive(this)}
        >
          <Header>
          {this.props.type.label}
          <ButtonArrowToggle active={this.props.active === this.props.type.label} />
        </Header>
        </MenuButtonToggle>
          <SideMenuDropDown
            open={this.props.active} 
            type={this.props.type} 
            active={this.props.active}
            setActive={this.props.setActive}
            title={this.state.dropdownTitle}
          />
        </>
      )
  }
}