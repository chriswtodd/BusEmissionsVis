/**
 * @author Chris Todd, chriswilltodd@gmail.com
 * Github: chriswtodd
 */ 

import React, { useState } from 'react';
import styled from "styled-components";

const styles = require("../../styles.js")

const InputCheckbox = styled.input`
    color: ${styles.text_colour_neg}
`;

const Label = styled.label`
    color: ${styles.text_colour_neg}
`;

const Container = styled.div`
    height: auto;
    width: auto;
    display: flex;
    flex-direction: row;
    padding: 2.5px;
`;

export default function Checkbox(props) {
    let [checked, setChecked] = useState(true);

    return (
        <Container>
            <InputCheckbox type="checkbox" 
                id={props.id} 
                name={props.name} 
                checked={checked} 
                onChange={(e) => {
                    setChecked(!checked);
                    props.callback(e, checked);
                }}/>
            <Label for={props.id}>{props.label}</Label>
        </Container>
    )
}