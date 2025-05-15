import React, { useState } from 'react';
import styled from "styled-components";

import { useSelector, useDispatch, connect } from 'react-redux';

import { setClasses, setReqGranularity, 
    setStartTime, setEndTime, setEmissionType, setStreamType } from '../redux/filterSlice.js';

// import TimePicker from './materialUi/TimePicker.jsx';

import RadioButtonGroup from "./radioButtonGroup.tsx";
import SideMenuContainer from "./sideMenuContainer.jsx";
import Checkbox from "./html/checkbox.jsx";

let modelData = require('../models/modelData.ts')
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

const SectionLabel = styled.span`
    display: flex;
    color: ${styles.text_colour_neg}
    border-bottom: 1px solid ${styles.background_colour}
    padding: 5px;
    width: 100%;
    opacity: 100;
    transition: all ease 0.2s;
`;

const SectionLabelToggle = styled(SectionLabel)`
  ${({ active }) =>
    active &&
    `
    display: none;
    opacity: 0;
  `}
`;

const CheckboxContainerToggle = styled(CheckboxContainer)`
  ${({ active }) =>
    active &&
    `
    display: none;
    opacity: 0;
  `}
`;

function SideMenuFilters(props) {
    const dispatch = useDispatch();
    const filters = useSelector(state => state.filters)

    const [granularity, setGranularity] = useState("day");
    const [emissionTypeRadio, setEmissionTypeRadio] = useState("CO2");
    const [streamTypeRadio, setStreamTypeRadio] = useState("Zero Offset");

    return (
        <SideMenuContainer label={"Visualisation Filters"}>
            <SectionLabel key={"label_engine-classes"} >
                Engine Classes:
            </SectionLabel>
            <CheckboxContainer id={"checkbox_engine-classes"} key={"checkbox_engine-classes"}>
                {filters != undefined ? Object.keys(filters.class).map(property => (
                    <Checkbox
                        id={property}
                        key={property}
                        name={property}
                        label={property}
                        color={modelData.EngineColours[property]}
                        callback={(e) => {
                            dispatch(setClasses(e.target.name));
                        }}
                        checked={filters.class[property]}
                    />
                )) : null}
            </CheckboxContainer>

            <SectionLabel id={"label_emission-type"} key={"label_emission-type"}>
                Emission Type:
            </SectionLabel>
            <CheckboxContainer id={"checkbox_emission-type"} key={"checkbox_emission-type"}>
                <RadioButtonGroup
                    options={modelData.EmissionTypeUi}
                    name="emissionTypeRadio"
                    onChange={
                        (checkedValue) => {
                            setEmissionTypeRadio(checkedValue)
                            dispatch(setEmissionType(checkedValue))
                        }
                    }
                    value={emissionTypeRadio}
                />
            </CheckboxContainer>
            
            <SectionLabel id={"label_granularity"} key={"label_granularity"}>
                Granularity:
            </SectionLabel>
            <CheckboxContainer id={"checkbox_granularity"} key={"checkbox_granularity"}>
                <RadioButtonGroup
                    options={{"day": "day"}}
                    name="granularity"
                    onChange={
                        (checkedValue) => {
                            setGranularity(checkedValue)
                            dispatch(setReqGranularity(checkedValue))
                        }
                    }
                    value={granularity}
                />
            </CheckboxContainer>
            
            <SectionLabel id={"label_trips-between"} key={"label_trips-between"}>
                Trips Between:
            </SectionLabel>
            <TimePickerContainer id={"div_trips-between"} key={"div_trips-between"}>

            </TimePickerContainer>

            <SectionLabelToggle 
                id={"label_stream-type"} 
                key={"label_stream-type"}
                active={props.streamTypeViewed}
            >
                Stream Type:
            </SectionLabelToggle>
            <CheckboxContainerToggle 
                id={"checkbox_stream_type"}
                key={"checkbox_stream_type"}
                active={props.streamTypeViewed}
            >
                <RadioButtonGroup
                    options={{
                        "Zero Offset": "Zero Offset", 
                        "Normalized": "Normalized"
                    }}
                    name="stream_offset"
                    isStateful={false}
                    onChange={
                        (checkedValue) => {
                            setStreamTypeRadio(checkedValue);
                            console.log(checkedValue)
                            dispatch(setStreamType(checkedValue))
                        }
                    }
                    value={streamTypeRadio}
                />
            </CheckboxContainerToggle>
        </SideMenuContainer>
    )
}
const mapStateToProps = (state) => {
    {
        return {
            streamTypeViewed: state.windows.windowRenderComponent != "Stream Graph"
        }
    }
}
export default connect(mapStateToProps)(SideMenuFilters);