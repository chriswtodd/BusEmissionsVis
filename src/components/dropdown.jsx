/**
 * @author Chris Todd, chriswilltodd@gmail.com
 * Github: chriswtodd
 */ 

import React from "react";
import styled from "styled-components";

const Dropbtn = styled.div`
  display: inline-block;
  color: white;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
`;

const DropDownContent = styled.div`
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
`;

const SubA = styled.a`
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  text-align: left;
  &:hover {
    background-color: #f1f1f1;
  }
`;

function DropDown(props) {
  let handleClick = action => {
    if (!action) return;

    if (props.onClick) props.onClick(action);
  };
    return (
        <>
          <Dropbtn onClick={() => handleClick("DropDown")}>
            DropDown
          </Dropbtn>
          <DropDownContent>
            {" "}
            <SubA onClick={() => handleClick("Link1")}>Link 1</SubA>
            <SubA onClick={() => handleClick("Link2")}>Link 2</SubA>
            <SubA onClick={() => handleClick("Link3")}>Link 3</SubA>
          </DropDownContent>
        </>
    );
}

export default DropDown;