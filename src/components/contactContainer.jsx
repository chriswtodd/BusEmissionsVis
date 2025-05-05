/**
 * @author Chris Todd, chriswilltodd@gmail.com
 * Github: chriswtodd
 */ 

import React from 'react';
import styled from "styled-components";

const ContactContainer = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 5%;
    padding: 2% 18%;
    background-color: rgb(0,0,0,0.1);
`;

const DescriptionContainer = styled.div`
    width: 45%;
`;

export default function Contacts (props) {

      return (
        <ContactContainer >
            <DescriptionContainer>
                <p style={{"font-weight": "bold"}}>Author</p>
                <p>
                    Chris Todd
                    <br />
                    chriswilltodd@gmail.com
                </p>
            </DescriptionContainer>
        </ContactContainer>
      )
}