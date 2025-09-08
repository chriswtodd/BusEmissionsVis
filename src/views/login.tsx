import { useState } from "react";
import { useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { useLoginMutation } from "../redux/query/loginApi.js";
import { ILoginCredentials } from "../models/loginModel.tsx";
import { setAccessToken, setTokenType, setExpiresIn } from "../redux/authSlice.ts";
import LoadingButton from "../components/loadingButton.jsx";
import Cookies from "js-cookie";

import styled from "styled-components";

const PageContainer = styled.div`
    display: table;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
`;

const FormContainer = styled.div`
  display: table-cell;
  vertical-align: middle;
`;

const LoginForm = styled.form`
    margin-left: auto;
    margin-right: auto;
    width: 400px;
    display: flex;
    flex-direction: column;
`;

const Title = styled.div`
    font-size: 2em;
    text-align: center;
    margin-bottom: 40px;
`;

const SubmitButton = styled.input`
    height: 40px;
    border-radius: 7px;
    color: rgb(248, 248, 248);
    background-color: rgba(0, 120, 138, 1);
    border-width: 1px;
    margin-top: 10px;
`;

const LoginInput = styled.input`
    line-height: 25px;
    border-radius: 7px;
    border-width: 1px;
    padding: 5px;
`;

const RegisterLabel = styled.label`
    text-align: center;
`;

const RegisterAnchor = styled.button`
    color: -webkit-link;
    cursor: pointer;
    text-decoration: underline;
    background-color: #ffffff00;
    border: none;
    font-size: 1em;
`;

const Login = () => {
    let dispatch = useDispatch();
    const [login, { isLoading: il, error: e }] = useLoginMutation();
    const url = useSelector(state => state.envVars.apiUrl);

    const [formData, setFormData] = useState<ILoginCredentials>({
        email: "",
        password: "",
    });
    const navigate = useNavigate();
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await login({ url: url, data: formData }).unwrap();
        navigate("/visualisations");
    };

    const handleClick = () => {
        navigate("/register");
    }

    return (
        <PageContainer>
            <FormContainer>
                <Title className="title">Sign in to your account</Title>
                <LoginForm onSubmit={handleSubmit}>
                    <label htmlFor="email">Email</label>
                    <LoginInput id="email" name="email" type="text" onChange={handleChange} />
                    <label htmlFor="password">Password</label>
                    <LoginInput id="password" name="password" type="password" onChange={handleChange} />       
                    {il ? <LoadingButton /> : <SubmitButton type="submit" value="SIGN IN" /> } 
                    <RegisterLabel>New to BEVFERLE? <RegisterAnchor onClick={handleClick}>Register</RegisterAnchor></RegisterLabel>
                </LoginForm>
            </FormContainer>
        </PageContainer>
    );
};

export default Login;