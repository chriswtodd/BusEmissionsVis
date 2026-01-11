/**
 * @author Chris Todd, chriswilltodd@gmail.com
 * Github: chriswtodd
 */ 

import React from 'react';
import styled from "styled-components";

const DemoContainer = styled.div`
    display: flex;
    justify-content: space-between;
    margin: 5% 18%;
    fontWeight: 300;
`;

const DemoTitle = styled.h3`
`;

const DescriptionContainer = styled.div`
    width: 45%;
`;

export default function Info (props) {
      return (
        <DemoContainer >
            <DescriptionContainer>
                <DemoTitle> About </DemoTitle>
                <p>
                    Visualisation tools are used to gain insights in to deep, complex data sets to find patterns and derive 
                    meaning.
                </p>
                <p>
                    This demo tool is largely a rewrite for a learning exercise of my honours project about bus emissions 
                    relating to bus network operations in Wellington, NZ and combinded them with models of greenhouse gas 
                    and harmful polutant emissions profiles for each bus trip according to the 
                    <a href="https://en.wikipedia.org/wiki/European_emission_standards">European emission standards</a> 
                    (their "EURO" classification) to generate approximations of polutant emissions caused by the operation 
                    of the network over some time period.
                </p>
                <p>
                    This is V3, using React & Redux with a .NET backend and a MongoDB Atlas Server serving data.
                </p>
                <p>
                    Originally written to using vanilla JS and Python, this application in its original state got too 
                    unweildy to manage iterating new features on as a solo developer. So, a few years ago I decided I 
                    would begin a rewrite; one that would allow me to iterate faster and easier. The original tool 
                    developed was hosted on Heroku, from October 2020 and was available until approximately Jun 2021, 
                    where it was replaced by a lightweight rewrite until 
                    (<a href="https://help.heroku.com/RSBRUH58/removal-of-heroku-free-product-plans-faq">Heroku removed 
                    their free tier at the end of 2022</a>). V2 was written using React and Redux, which served as a 
                    halfway step to this tech stack.
                </p>
            </DescriptionContainer>
            <DescriptionContainer>
                <DemoTitle> How to use </DemoTitle>
                <div>
                    <h4>Login</h4>
                    
                    <p>The tool is secured with Google Login.</p>
                    <img src={"./google-login.png"} style={{ width: "95%", margin: "2.5%" }}></img>
                    <p>Once you have logged in, you can access other pages to interact with the data.</p>
                </div>
                <div>
                    <h4>Filters</h4>
                    
                    <p>Visualisation Selector</p>
                    <img src={"./visualisation-selector.png"} style={{ width: "95%", margin: "2.5%" }}></img>
                    <p>Select how you would like to view the data on the page.</p>

                    <p>Engine Classes</p>
                    <img src={"./engine-classes.png"} style={{ width: "95%", margin: "2.5%" }}></img>
                    <p>Select the engine classes included in the visualisation.</p>

                    <p>Emission Type</p>
                    <img src={"./emission-type.png"} style={{ width: "95%", margin: "2.5%" }}></img>
                    <p>Select the emission type to view on the y axis.</p>

                    <p>Trips Between</p>
                    <img src={"./trips-between.png"} style={{ width: "95%", margin: "2.5%" }}></img>
                    <p>Select the times of bus trips to include in the data. Triggers a data reload.</p>

                    <p>Routes</p>
                    <img src={"./routes.png"} style={{ width: "95%", margin: "2.5%" }}></img>
                    <p>Select the bus routes to be included in the data. To trigger a data reload, click 
                    the "Load New Data" button.</p>
                </div>
            </DescriptionContainer>
        </DemoContainer>
      )
}