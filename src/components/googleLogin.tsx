import { useEffect } from 'react'
import { useUserInfoMutation, useWhoQuery } from "../redux/query/loginApi.js";
import { setUserInfo } from "../redux/authSlice.js";
import { useSelector, useDispatch } from "react-redux";

import styled from "styled-components";

const styles = require('../styles.js');

const Container = styled.div`
    margin-left: auto;
    margin-right: 3px;
    background-color: white;
    border-radius: 4px;
`

const Tooltip = styled.span`
    visibility: hidden;
    opacity: 0;
    background-color: #333;
    color: #fff;
    text-align: center;
    border-radius: 4px;
    padding: 5px 10px;
    position: absolute;
    transition: opacity 0.3s, visibility 0.3s;
    white-space: nowrap;
    top: 125%;
    &:after {
        content: " ";
        position: absolute;
        bottom: 100%;
        left: 50%;
        margin-left: -5px;
        border-width: 5px;
        border-style: solid;
        border-color: transparent transparent #333 transparent;
    }
`

const ClickContainer = styled.div`
    height: 44px;
    max-width: 400px;
    min-width: 200px;
    width: 250px;
    padding: 2px 10px;
    position: relative;
    border: ${styles.container_border};
    border-radius: 4px;
    color: ${styles.text_colour_neg};
    box-sizing: border-box;
    font-family: "Google Sans", arial, sans-serif;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    flex-direction: row;
    transition: background-color .218s, border-color .218s;
    background-color: #fff;
    cursor: pointer;
    align-items: center;
    vertical-align: middle;
    &:hover {
        box-shadow: none;
        border-color: rgb(210, 227, 252);
        outline: none;
        background-color: rgba(66, 133, 244, 0.08);
    }
    &:hover ${Tooltip} {
        visibility: visible;
        opacity: 1;
    }
    &:active {
        background-color: rgba(66, 133, 244, 0.1);
        outline: 2px solid #00639b;
    }
    &:focus {
        outline: 2px solid #00639b;
        border-color: transparent;
    }
`

const ProfileIcon = styled.img`
    border-radius: 50%;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    height: 20px;
    margin-left: -4px;
    margin-right: 8px;
    min-width: 20px;
    width: 20px;
`

const GoogleIcon = styled(ProfileIcon)`
    margin-left: 0px;
    margin-right: 0px;
    margin-left: auto;
`;

const WelcomeContainer = styled.div`

`

const EmailContainer = styled.div`
    font-size: 11px;
    font-weight: 400;
    color: ${styles.text_colour_neg_light};
`

export function GoogleLogin() {
    const dispatch = useDispatch();

    const url = useSelector(state => state.envVars.apiUrl);
    const currentUserInfo = useSelector(state => state.auth.userInfo);

    const {data: who, isFetching: wl, error: we } = useWhoQuery({ url: url });
    const [userInfo, { isLoading: ul, error: ue }] = useUserInfoMutation();

    useEffect(() => {
        async function updateUser()
        {
            const enabled = !wl && !we && who !== undefined ? who.isAuthenticated : false;
            if (enabled)
            {
                const r = await userInfo({ url: url }).unwrap();
                dispatch(setUserInfo(r));
            }
        }
        
        updateUser();
    }, [who, wl, we])

    const handleSignIn = () => 
    {
        const urlObject = new URL(window.location.href);
        const pathname = encodeURI(urlObject.pathname);
        window.location.href = `https://localhost:7076/api/auth/google?callback=${pathname}`;
    }

    const handleSignOut = () => {
        dispatch(setUserInfo(null))
        const urlObject = new URL(window.location.href);
        const pathname = encodeURI(urlObject.pathname);
        window.location.href = `https://localhost:7076/api/auth/logout?callback=${pathname}`;
    }

    return (
        <Container>
            {currentUserInfo ? (
                <div>
                    <ClickContainer onClick={handleSignOut}>
                        <ProfileIcon src={currentUserInfo.picture} alt={"user-profile-image"} loading="lazy" />
                        <div>
                            <WelcomeContainer>Welcome {currentUserInfo.givenName}</WelcomeContainer>
                            <EmailContainer>{currentUserInfo.email}</EmailContainer>
                        </div>
                        <GoogleIcon src={"https://www.gstatic.com/marketing-cms/assets/images/d5/dc/cfe9ce8b4425b410b49b7f2dd3f3/g.webp=s48-fcrop64=1,00000000ffffffff-rw"} alt={"user-profile-image"} loading="lazy" />
                        <Tooltip>Sign Out</Tooltip>
                    </ClickContainer>
                </div>
            ) : (
                <ClickContainer onClick={handleSignIn}>
                    <ProfileIcon src={"https://www.gstatic.com/marketing-cms/assets/images/d5/dc/cfe9ce8b4425b410b49b7f2dd3f3/g.webp=s48-fcrop64=1,00000000ffffffff-rw"} alt={"user-profile-image"} loading="lazy" />
                    <p>Sign in with Google</p>
                </ClickContainer>
            )}
        </Container>
    )
}