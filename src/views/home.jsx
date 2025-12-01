/**
 * @author Chris Todd, chriswilltodd@gmail.com
 * Github: chriswtodd
 */ 
import React from 'react';

import Banner from "../components/banner.jsx";
import Info from "../components/infoContainer.jsx";
import Actions from "../components/actionsContainer.jsx";
import Contacts from "../components/contactContainer.jsx";

export default function Home() {
    return (
        <>
            <Banner />
            <Info />
            <Actions />
            <Contacts />
        </>
    );
}