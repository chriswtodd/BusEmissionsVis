/**
 * @author Chris Todd, chriswilltodd@gmail.com
 * Github: chriswtodd
 */ 

import React from 'react';
import styled from "styled-components";
import { FaTimesCircle } from 'react-icons/fa';

const Button = styled(FaTimesCircle)`
    color: white;
    transition: all ease 0.3s;
    width: 25px;
    height: 25px;
    right: 5px;
    top: 7.5px;
    display: flex;
    position: absolute;
    opacity: 1;
    &:hover {
        color: red;
    }
`;

function closeContainer(component) {
    component.container.setState({open:false});
}

export default class CloseButtonFactory extends React.Component {
    constructor(props) {
        super(props);
        this.container = props.container;
    }

    render() {
        return (
            <Button container={this.props.container} onClick={() => closeContainer(this)}/>
        )
    }
}