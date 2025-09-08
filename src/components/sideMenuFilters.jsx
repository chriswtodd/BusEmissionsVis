import React, { useState } from 'react';
import styled from "styled-components";
import { IoIosArrowForward } from 'react-icons/io';

import { useSelector, useDispatch, connect } from 'react-redux';

import { setClasses, setReqGranularity, 
    setStartTime, setEndTime, setEmissionType, setStreamType, toggleRoute } from '../redux/filterSlice.js';

import { EngineClasses, EmissionType, Granularity, TripsBetween, StreamType, Routes } from '../models/filters.ts'

import RadioButtonGroup from "./radioButtonGroup.tsx";
import SideMenuContainer from "./sideMenuContainer.jsx";
import Checkbox from "./html/checkbox.jsx";

import { useUpdateRoutesMutation } from '../redux/query/emissionsApi.js';

import { DefaultStartTime, DefaultEndTime } from '../common/Constants'

let modelData = require('../models/modelData.ts')
const styles = require("../styles.js")

const Container = styled.div`
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;
    height: 0;
    color: ${styles.text_colour_neg}
    display: none;
    opacity: 0;
    transition: all ease 0.2s;
`;

const TimePickerContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-evenly;
    color: ${styles.text_colour_neg}
`;

const SectionLabel = styled.div`
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

const CollapsableContainer = styled(Container)`
  ${({ active }) =>
    active &&
    `
    height: auto;
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
    const url = useSelector(state => state.envVars.apiUrl);
    const filters = useSelector(state => state.filters);
    const token = useSelector(state => state.auth.accessToken);
    const tokenType = useSelector(state => state.auth.tokenType);

    let filterContainers = {};
    filterContainers[EngineClasses.Key] = false;
    filterContainers[EmissionType.Key] = false;
    filterContainers[Granularity.Key] = false;
    filterContainers[TripsBetween.Key] = false;
    filterContainers[StreamType.Key] = false;
    filterContainers[Routes.Key] = false;

    const [granularity, setGranularity] = useState("day");
    const [emissionTypeRadio, setEmissionTypeRadio] = useState("CO2");
    const [streamTypeRadio, setStreamTypeRadio] = useState("Zero Offset");
    const [openFilters, setOpenFilters] = useState(filterContainers);
    const [updateRoutes, { isLoading }] = useUpdateRoutesMutation();

    function modifyFiltersOpen(event) {
        var title = event.target.getAttribute("for");
        var f = {...openFilters};
        f[title] = !f[title]
        setOpenFilters(f);
    }

    const handleUpdateRoutes = () => {
        updateRoutes({
            baseUrl: url,
            accessToken: token,
            tokenType: tokenType,
            model: JSON.stringify({
                routes: filters.routes
            })
        });
    };

    return (
        <SideMenuContainer label={"Visualisation Filters"}>
            <SectionLabel 
                htmlFor={EngineClasses.Key}
                key={"label_engine-classes"}
                onClick={modifyFiltersOpen}
            >
                Engine Classes: <ButtonArrowToggle active={openFilters[EngineClasses.Key]} />
            </SectionLabel>
            <CollapsableContainer 
                id={"checkbox_engine-classes"}
                active={openFilters[EngineClasses.Key]}
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
            </CollapsableContainer>

            <SectionLabel 
                htmlFor={EmissionType.Key}
                id={"label_emission-type"} 
                key={"label_emission-type"}
                onClick={modifyFiltersOpen}
            >
                Emission Type:  <ButtonArrowToggle active={openFilters[EmissionType.Key]} />
            </SectionLabel>
            <CollapsableContainer 
                id={"checkbox_emission-type"} 
                key={"checkbox_emission-type"}
                active={openFilters[EmissionType.Key]}
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
            </CollapsableContainer>
            
            <SectionLabel 
                htmlFor={Granularity.Key}
                id={"label_granularity"} 
                key={"label_granularity"}
                onClick={modifyFiltersOpen}
            >
                Granularity:  <ButtonArrowToggle active={openFilters[Granularity.Key]} />
            </SectionLabel>
            <CollapsableContainer 
                id={"checkbox_granularity"} 
                key={"checkbox_granularity"}
                active={openFilters[Granularity.Key]}
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
            </CollapsableContainer>
            
            <SectionLabel 
                htmlFor={TripsBetween.Key}
                id={"label_trips-between"} 
                key={"label_trips-between"}
                onClick={modifyFiltersOpen}
            >
                Trips Between:  <ButtonArrowToggle active={openFilters[TripsBetween.Key]} />
            </SectionLabel>
            <CollapsableContainer
                id={"container_trips-between"} 
                key={"container_trips-between"}
                active={openFilters[TripsBetween.Key]}
            >
                <TimePickerContainer 
                    id={"div_trips-between"} 
                    key={"div_trips-between"}
                >
                    <input
                        type="time"
                        id="trips-between_startTime"
                        name="trips-between_startTime"
                        value={filters.startTime}
                        min={DefaultStartTime}
                        max={DefaultEndTime}
                        step="1"
                        onChange={(e) => {
                            dispatch(setStartTime(e.target.value))
                        }}
                    />
                    <input
                        type="time"
                        id="trips-between_endTime"
                        name="trips-between_endTime"
                        value={filters.endTime}
                        min={DefaultStartTime}
                        max={DefaultEndTime}
                        step="1"
                        onChange={(e) => {
                            dispatch(setEndTime(e.target.value))
                        }}
                    />
                </TimePickerContainer>
            </CollapsableContainer>

            <SectionLabel 
                htmlFor={StreamType.Key}
                id={"label_stream-type"} 
                key={"label_stream-type"}
                active={props.streamTypeViewed}
                onClick={modifyFiltersOpen}
            >
                Stream Type:  <ButtonArrowToggle active={openFilters[StreamType.Key]} />
            </SectionLabel>
            <CollapsableContainer 
                id={"checkbox_stream_type"}
                key={"checkbox_stream_type"}
                active={props.streamTypeViewed && openFilters[StreamType.Key]}
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
            </CollapsableContainer>

            <SectionLabel
                htmlFor={Routes.Key}
                id={"label_routes"} 
                key={"label_routes"}
                onClick={modifyFiltersOpen}
            >
                Routes: <ButtonArrowToggle active={openFilters[Routes.Key]}/>
            </SectionLabel>
            <CollapsableContainer 
                id={"checkbox_routes"}
                active={openFilters[Routes.Key]}
            >
            <button 
                onClick={handleUpdateRoutes}
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
            </CollapsableContainer>
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