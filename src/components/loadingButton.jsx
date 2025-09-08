
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

import styled from "styled-components";

const Button = styled.button`
    height: 40px;
    border-radius: 7px;
    color: rgb(248, 248, 248);
    background-color: rgb(37, 37, 37);
    border-width: 1px;
    margin-top: 10px;
`;

const LoadingButton = () => {
    return (
        <Button> 
            <FontAwesomeIcon icon={faSpinner} spin />
        </Button>
    );
};

export default LoadingButton;