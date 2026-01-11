import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setVisible } from "../redux/notificationSlice";

import styled from "styled-components";

const styles = require('../styles.js');

const Container = styled.div`
    margin-left: auto;
    margin-right: 3px;
    background-color: white;
    border-radius: 4px;
    position: absolute;
    min-width: 200px;
    max-width: 80%;
    width: auto;
    height: 50px;
    top: -10%;
    left: 50%;
    transform: translate(-50%, -50%);
    border: ${styles.container_border};
    display: flex;
    align-items: center;
    transition: all 250ms cubic-bezier(.21,1,.73,1);
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
    &.active {
        top: 10%;
    }
`

const Message = styled.div`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`;

export function Notification() {
    const dispatch = useDispatch();

    const isVisible = useSelector(state => state.notification.isVisible);
    const title = useSelector(state => state.notification.title);
    const message = useSelector(state => state.notification.message);

    useEffect(() => {
        const timerId = setTimeout(() => {
            dispatch(setVisible(false));
        }, 3000);

        return () => {
            clearTimeout(timerId);
        };
    }, [isVisible]);
    
    return <Container className={isVisible ? 'active' : ''}>
            {title}
            <Message>{message}</Message>
        </Container>
}