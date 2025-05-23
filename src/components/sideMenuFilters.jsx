import React, { useState } from 'react';
import styled from "styled-components";
import { IoIosArrowForward } from 'react-icons/io';

import { useSelector, useDispatch, connect } from 'react-redux';

import { setClasses, setReqGranularity, 
    setStartTime, setEndTime, setEmissionType, setStreamType, toggleRoute, setReload } from '../redux/filterSlice.js';

// import TimePicker from './materialUi/TimePicker.jsx';

import RadioButtonGroup from "./radioButtonGroup.tsx";
import SideMenuContainer from "./sideMenuContainer.jsx";
import Checkbox from "./html/checkbox.jsx";

let modelData = require('../models/modelData.ts')
const styles = require("../styles.js")

const CheckboxContainer = styled.div`
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

const SectionLabel = styled.span`
    display: flex;
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
        console.log(openFilters)
        console.log(title.target)
        filterContainers[title] = !filterContainers[title];
        setOpenFilters(filterContainers);
    }

    return (
        <SideMenuContainer label={"Visualisation Filters"}>
            <SectionLabel 
                key={"label_engine-classes"}
                onClick={modifyFiltersOpen}
            >
                Engine Classes: <ButtonArrowToggle active={openFilters["Engine Classes"]} />
            </SectionLabel>
            <CheckboxContainerToggle 
                id={"checkbox_engine-classes"}
                active={openFilters["Engine Classes"]}
            >
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
            </CheckboxContainerToggle>

            <SectionLabel id={"label_emission-type"} key={"label_emission-type"}>
                Emission Type:
            </SectionLabel>
            <CheckboxContainerToggle 
                id={"checkbox_emission-type"} 
                key={"checkbox_emission-type"}
                active={openFilters["Emission Type"]}
            >
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
            </CheckboxContainerToggle>
            
            <SectionLabel 
                id={"label_granularity"} 
                key={"label_granularity"}
            >
                Granularity:
            </SectionLabel>
            <CheckboxContainerToggle 
                id={"checkbox_granularity"} 
                key={"checkbox_granularity"}
                active={openFilters["Granularity"]}
            >
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
            </CheckboxContainerToggle>
            
            <SectionLabel 
                id={"label_trips-between"} 
                key={"label_trips-between"}
            >
                Trips Between:
            </SectionLabel>
            <TimePickerContainer 
                id={"div_trips-between"} 
                key={"div_trips-between"}
            >
                <input
                    type="time"
                    id="trips-between_startTime"
                    name="trips-between_startTime"
                    value={filters.startTime}
                    min="00:00"
                    max="23:59"
                    onChange={(e) => {
                        dispatch(setStartTime(e.target.value))
                    }}
                />
                <input
                    type="time"
                    id="trips-between_endTime"
                    name="trips-between_endTime"
                    value={filters.endTime}
                    min="00:01"
                    max="23:59"
                    onChange={(e) => {
                        dispatch(setEndTime(e.target.value))
                    }}
                />
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
                            dispatch(setStreamType(checkedValue));
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
            <button 
                onClick={() => {
                    dispatch(setReload(true))
                }}
                style={{"width": "85%","backgroundColor": "#67e037","borderRadius":"25px"}}> 
                Load New Data 
            </button>

            {filters?.routes != undefined ? Object.keys(filters.routes).map(property => (
                    <Checkbox
                        id={property}
                        key={property}
                        name={property}
                        label={property}
                        color={modelData.EngineColours[property]}
                        callback={(e) => {
                            dispatch(toggleRoute(e.target.name));
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
            routes: state.filters.routes,
            reload: state.filters.reload,
        }
    }
}
export default connect(mapStateToProps)(SideMenuFilters);