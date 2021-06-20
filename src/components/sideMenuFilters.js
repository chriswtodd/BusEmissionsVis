import React, { useState } from 'react';
import ReactRadioButtonGroup from 'react-radio-button-group';
import styled from "styled-components";

import { useSelector, useDispatch } from 'react-redux';

import { setClasses, setReqGranularity, 
    setStartTime, setEndTime, setEmissionType } from '../redux/filterSlice.js';

import TimePicker from './materialUi/TimePicker.js';

import SideMenuContainer from "./sideMenuContainer.js";
import Checkbox from "./html/checkbox.js";

let modelData = require('../models/modelData.js')
const styles = require("../styles.js")

const CheckboxContainer = styled.div`
    display: flex;
    // flex-direction: column;
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;
    height: auto;
    color: ${styles.text_colour_neg}
`;

const TimePickerContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-evenly;
    color: ${styles.text_colour_neg}
`;

const SectionLabel = styled.text`
    display: flex;
    color: ${styles.text_colour_neg}
    border-bottom: 1px solid ${styles.background_colour}
    padding: 5px;
    width: 100%;
`;

export default function SideMenuFilters(props) {
    const dispatch = useDispatch();
    const filters = useSelector(state => state.filters)

    const [granularity, setGranularity] = useState("day");
    const [emissionTypeRadio, setEmissionTypeRadio] = useState("CO2");

    return (
        <SideMenuContainer label={"Visualisation Filters"}>
            <SectionLabel>
                Engine Classes:
            </SectionLabel>
            <CheckboxContainer id={"checkbox_engine-classes"}>
                {filters != undefined ? Object.keys(filters.class).map(property => (
                    <Checkbox
                        id={property}
                        name={property}
                        label={property}
                        color={modelData.engine_colours[property]}
                        callback={(e) => {
                            dispatch(setClasses(e.target.name));
                        }}
                    />
                )) : null}
            </CheckboxContainer>

            <SectionLabel>
                Emission Type:
            </SectionLabel>
            <CheckboxContainer id={"checkbox_granularity"}>
                <ReactRadioButtonGroup
                    options={["CO2", "CO", "Fuel Consumption", "Hydro Carbons", "Nitrogen Oxide", "Particulate Matter", "Passenger Km"]}
                    name="emissionTypeRadio"
                    isStateful={false}
                    onChange={
                        (checkedValue) => {
                            setEmissionTypeRadio(checkedValue)
                            dispatch(setEmissionType(checkedValue))
                        }
                    }
                    value={emissionTypeRadio}
                />
            </CheckboxContainer>
            
            <SectionLabel>
                Granularity:
            </SectionLabel>
            <CheckboxContainer id={"checkbox_granularity"}>
                <ReactRadioButtonGroup
                    options={["day"]}
                    name="granularity"
                    isStateful={false}
                    onChange={
                        (checkedValue) => {
                            setGranularity(checkedValue);
                            dispatch(setReqGranularity(checkedValue))
                        }
                    }
                    value={granularity}
                />
            </CheckboxContainer>
            
            <SectionLabel>
                Trips Between:
            </SectionLabel>
            <TimePickerContainer>
                <TimePicker
                    id={"start_time"}
                    label={"Start Time"}
                    defaultValue={"00:00"}
                    onChange={(e) => {
                        dispatch(setStartTime(e.target.value));
                    }}
                />
                <TimePicker
                    id={"end_time"}
                    label={"End Time"}
                    defaultValue={"23:59"}
                    onChange={(e) => {
                        dispatch(setEndTime(e.target.value));
                    }}
                />
            </TimePickerContainer>
        </SideMenuContainer>
    )
}