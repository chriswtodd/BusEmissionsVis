/**
 * @author Chris Todd, chriswilltodd@gmail.com
 * Github: chriswtodd
 */ 

import React from 'react';
import styled from "styled-components";

const InfoContainer = styled.div`
    display: flex;
    justify-content: space-between;
    margin: 5% 18%;
    font-weight: 300;
`;

const InfoTitle = styled.h3`
`;

const DescriptionContainer = styled.div`
    width: 45%;
`;

export default function Info (props) {

      return (
        <InfoContainer >
            <DescriptionContainer>
                <InfoTitle> About the Project </InfoTitle>
                <p>
                    This project is a redesign of <a href={"https://warm-temple-67996.herokuapp.com/"}>BEVis</a>, a research tool designed over 3 years
                    with 3 developers, Greater Wellington Regional Council, and VUW. The final iteration above was finished over
                    my engineering honours project, and a collaboration with NZTA over 3 months to test new datasets.
                    <br /><br />
                    The goal of the original project was to produce a web application that can help transport analysts visualise
                    data about the a public transport network. This tool aimed to compliment existing techniques
                    to allow analysts to visualise data, find insights, and report their findings.
                    This project (BEVFERLE) builds on the code developed for my Honours project in Software Engineering, Greater Wellington (GW)
                    and NZTA. Supervised by Dr. Craig Anslow of Victoria University of Wellington, and Chris Vallyon of the GW/NZTA.
                </p>
            </DescriptionContainer>
            <DescriptionContainer>
                <InfoTitle> The Prototype </InfoTitle>
                <p>
                    BEVFERLE's front end is built using React and Redux. Redux has delivered a lot of value for the codebase, making
                    introducing filters etc far easier than before. React makes component and page design cleaner than it was 
                    previously, and making use of React-Redux provides a more clear implementation than previously possible by introducing
                    a state management technique. All code has been refactored, including the D3 graphs I have implemented, to be reused in
                    other projects without cross dependancies (ie React components only rely on React and styled).
                    <br /><br />
                    The backend has been cleaned by removing redundant code and sped up by including appropriate complex indexes 
                    to support queries from MongoAtlas. Using the indexes, more of the computational load can be shifted to MongoAtlas  
                    without requests timing out, and decreasing load on local machinces, providing a better user experience for everyone. 
                    Python with Flask is still the server, as porting this to node was considered out of scope. 
                </p>
            </DescriptionContainer>
        </InfoContainer>
      )
}