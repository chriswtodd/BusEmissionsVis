/**
 * @author Chris Todd, chriswilltodd@gmail.com
 * Github: chriswtodd
 */ 

import React, { useState } from 'react';
import styled from "styled-components";
import { useLoading, Circles } from '@agney/react-loading';


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

const LoadingBarPercent = styled.text`
    position: absolute;
    align-self: center;
    z-index: 51;
    fill: #222;
    color: #222;
`;

const LoadingWrapper = styled.div`
    position: fixed;
    opacity: 0;
    height: 100%;
    width: 100%;
    z-index: 50;
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
    const { containerProps, indicatorEl } = useLoading({
        loading: true,
        loaderProps: {
            // Any props here would be spread on to the indicator element.
            style: { color: 'rgba(0,120,138,100)', padding: '10px' },
            valueText: "Fetching data..."
          },
        indicator: <Circles width="150" />,
      });

    return (
        <LoadingWrapper>
            <LoadingContainer>
                <section {...containerProps}>
                    {indicatorEl} {/* renders only while loading */}
                </section>
                <LoadingBarContainer>
                    <LoadingBarProgress>
                    </LoadingBarProgress>
                    <LoadingBarPercent>
                    </LoadingBarPercent>
                </LoadingBarContainer>
            </LoadingContainer>
        </LoadingWrapper>
    )
}