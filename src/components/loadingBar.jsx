/**
 * @author Chris Todd, chriswilltodd@gmail.com
 * Github: chriswtodd
 */ 

import React, { useState } from 'react';
import { connect, useSelector } from 'react-redux';

import { useLoading, Circles } from '@agney/react-loading';

import styled from "styled-components";

const LoadingBarContainer = styled.div`
    background: white;
    height: 35px;
    width: 30%;
    padding: 20px;
    align-content: center;
    align-items: center;
    display: flex;
    flex-direction: row;
`;

const LoadingBarProgress = styled.div`
  background: var(--gradient-2);
  width: 1%;
  height: 100%;
  padding: 15px;
  `;

const LoadingBarPercent = styled.span`
    position: absolute;
    align-self: center;
    zIndex: 51;
    fill: #222;
    color: #222;
`;

const LoadingWrapper = styled.div`
    position: fixed;
    opacity: 0;
    height: 100%;
    width: 100%;
    zIndex: 50;
    pointer-events: none;
`;

const LoadingContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0,0,0,0.5);
    height: 100%;
    flex-direction: column;
`;

export default function LoadingBar() {
    let loadingState = useSelector(state => state.envVars.loading)
    const { containerProps, indicatorEl } = useLoading({
        loading: loadingState,
        loaderProps: {
            // Any props here would be spread on to the indicator element.
            style: { 
                color: 'rgba(0,120,138,100)', 
                padding: '10px',
                position: 'absolute',
                left: "50%",
                top: "35%",
                "zIndex": "10000",
            },
            valueText: "Fetching data..."
          },
        indicator: <Circles width="15%" />,
      });

    return (
        // <LoadingWrapper>
        //     <LoadingContainer>
                <section {...containerProps}>
                    {indicatorEl} {/* renders only while loading */}
                </section>
        //         {/* <LoadingBarContainer>
        //             <LoadingBarProgress>
        //             </LoadingBarProgress>
        //             <LoadingBarPercent>
        //             </LoadingBarPercent>
        //         </LoadingBarContainer>
        //     </LoadingContainer>
        // </LoadingWrapper> */}
    )
}

// const mapStateToProps = (state) => {
//     let loadingState = true;
//     if (state.windows.windowRenderComponent === "Stream Graph" && Array.isArray(state.data.streamData)) {
//         loadingState = false;
//     } else if (state.windows.windowRenderComponent === "Stream Graph" && state.streamData != {}) {

//     }
//     return {
//         loading: loadingState,
//     }
// }
// export default connect(mapStateToProps)(LoadingBar);