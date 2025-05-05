/**
 * @author Chris Todd, chriswilltodd@gmail.com
 * Github: chriswtodd
 */ 

import React, { useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import Banner from "../components/banner.jsx";
import Info from "../components/infoContainer.jsx";
import Actions from "../components/actionsContainer.jsx";
import Contacts from "../components/contactContainer.jsx";

export default function Home(props) {
    let dispatch = useDispatch();
    //App

    return (
        <>
        <Banner />
        <Info />
        <Actions />
        <Contacts />
        </>
    );
}