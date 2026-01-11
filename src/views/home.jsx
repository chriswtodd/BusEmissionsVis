/**
 * @author Chris Todd, chriswilltodd@gmail.com
 * Github: chriswtodd
 */ 
import React from 'react';

import Banner from "../components/home/banner.jsx";
import Info from "../components/home/demoContainer.jsx";
import Actions from "../components/home/actionsContainer.jsx";
import Contacts from "../components/home/contactContainer.jsx";

export default function Home(props) {

    return (
        <>
            <Banner />
            <Info />
            <Actions />
            <Contacts />
        </>
    );
}