/**
 * @author Chris Todd, chriswilltodd@gmail.com
 * Github: chriswtodd
 */ 

import React, { useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import Banner from "../components/banner.js";
import Info from "../components/infoContainer";
import Actions from "../components/actionsContainer";
import Contacts from "../components/contactContainer";

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