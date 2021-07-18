import React, { useState } from 'react';
import ReactRadioButtonGroup from 'react-radio-button-group';
import styled from "styled-components";
import { IoIosArrowForward } from 'react-icons/io';

import { useSelector, useDispatch, connect } from 'react-redux';

import { setClasses, setReqGranularity, 
    setStartTime, setEndTime, setEmissionType, setStreamType, setRoutes } from '../redux/filterSlice.js';

import TimePicker from './materialUi/TimePicker.js';

import SideMenuContainer from "./sideMenuContainer.js";
import Checkbox from "./html/checkbox.js";

let modelData = require('../models/modelData.js')
const styles = require("../styles.js")

const CheckboxContainer = styled.div`
    // flex-direction: column;
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;
    height: auto;
    color: ${styles.text_colour_neg}
    display: none;
    opacity: 0;
`;

const TimePickerContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-evenly;
    color: ${styles.text_colour_neg}
`;

const SectionLabel = styled.text`
    color: ${styles.text_colour_neg}
    border-bottom: 1px solid ${styles.background_colour}
    padding: 5px;
    margin: 5px;
    width: 100%;
    opacity: 100;
    transition: all ease 0.2s;
    justify-content: space-between;
    display: flex;
    opacity: 1;
`;

const SectionLabelToggle = styled(SectionLabel)`
  ${({ inactive }) =>
    inactive &&
    `
    display: none;
    opacity: 0;
  `}
`;

const CheckboxContainerToggle = styled(CheckboxContainer)`
  ${({ active }) =>
    active &&
    `
    display: flex;
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
    transform: rotate(-90deg);
  `}
`;

function SideMenuFilters(props) {
    const dispatch = useDispatch();
    const filters = useSelector(state => state.filters)

    let filterContainers = {
        "Engine Classes" : true,
        "Emission Type" : true,
        "Granularity" : true,
        "Trips Between" : true,
        "Stream Type" : true,
        "Routes" : true,        
    }

    const [granularity, setGranularity] = useState("day");
    const [emissionTypeRadio, setEmissionTypeRadio] = useState("CO2");
    const [streamTypeRadio, setStreamTypeRadio] = useState("Zero Offset");
    const [openFilters, setOpenFilters] = useState(filterContainers);

    function modifyFiltersOpen(title) {
        filterContainers[title] = !filterContainers[title];
        setOpenFilters(filterContainers);
        console.log(openFilters);
    }

    return (
        <SideMenuContainer label={"Visualisation Filters"}>
            <SectionLabel>
                Engine Classes: <ButtonArrowToggle active={openFilters["Engine Classes"]} />
            </SectionLabel>
            <CheckboxContainerToggle 
                id={"checkbox_engine-classes"}
                active={openFilters["Engine Classes"]}
            >
                {filters != undefined ? Object.keys(filters.class).map(property => (
                    <Checkbox
                        id={property}
                        name={property}
                        label={property}
                        color={modelData.engine_colours[property]}
                        callback={(e) => {
                            dispatch(setClasses(e.target.name));
                        }}
                        checked={filters.class[property]}
                    />
                )) : null}
            </CheckboxContainerToggle>

            <SectionLabel>
                Emission Type: <ButtonArrowToggle active={openFilters["Emission Type"]}/>
            </SectionLabel>
            <CheckboxContainerToggle 
                id={"checkbox_emission-type"}
                active={openFilters["Emission Type"]}
            >
                <ReactRadioButtonGroup
                    options={modelData.emission_type_ui}
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
            </CheckboxContainerToggle>
            
            <SectionLabel>
                Granularity: <ButtonArrowToggle active={openFilters["Granularity"]}/>
            </SectionLabel>
            <CheckboxContainerToggle 
                id={"checkbox_granularity"}
                active={openFilters["Granularity"]}
            >
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
            </CheckboxContainerToggle>
            
            <SectionLabel>
                Trips Between: <ButtonArrowToggle active={openFilters["Trips Between"]}/>
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

            <SectionLabelToggle inactive={!props.streamTypeViewed}>
                Stream Type: <ButtonArrowToggle active={openFilters["Stream Type"]}/>
            </SectionLabelToggle>
            <CheckboxContainerToggle 
                id={"checkbox_stream_type"}
                active={props.streamTypeViewed}
            >
                <ReactRadioButtonGroup
                    options={["Zero Offset", "Normalized"]}
                    name="stream_offset"
                    isStateful={false}
                    onChange={
                        (checkedValue) => {
                            setStreamTypeRadio(checkedValue);
                            dispatch(setStreamType(checkedValue))
                        }
                    }
                    value={streamTypeRadio}
                />
            </CheckboxContainerToggle>

            <SectionLabelToggle>
                Routes: <ButtonArrowToggle active={openFilters["Routes"]}/>
            </SectionLabelToggle>
            <CheckboxContainerToggle 
                id={"checkbox_routes"}
                active={openFilters["Routes"]}
            >

            {filters != undefined ? Object.keys(filters.routes).map(property => (
                    <Checkbox
                        id={property}
                        name={property}
                        label={property}
                        color={modelData.engine_colours[property]}
                        callback={(e) => {
                            dispatch(setRoutes(e.target.name));
                        }}
                        checked={filters.routes[property]}
                    />
                )) : null}
            </CheckboxContainerToggle>
        </SideMenuContainer>
    )
}
const mapStateToProps = (state) => {
    {
        return {
            streamTypeViewed: state.windows.windowRenderComponent === "Stream Graph",
            routes: state.filters.routes
        }
    }
}
export default connect(mapStateToProps)(SideMenuFilters);