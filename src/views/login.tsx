import { useState } from "react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { useLoginMutation } from "../react-query/createSessionApi.js";
import { ILoginCredentials } from "../models/loginModel.tsx"
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
`;

const SubmitButton = styled.input`
    height: 40px;
    border-radius: 25px;
    color: rgb(248, 248, 248);
    background-color: rgba(0, 120, 138, 1);
`;

const Login = () => {
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

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        var res = await login({ url: url, data: formData }).unwrap();
        console.log(res);
        // http cookies
        Cookies.set("token", res?.token, {expires: 1/1440, path: "/"});
        Cookies.set("role", res?.role, {expires: 1/1440, path: "/"});
        navigate("/visualisations");
    };

    return (
        <PageContainer>
            <FormContainer>
                <LoginForm onSubmit={handleSubmit}>
                    <Title className="title">Login</Title>
                    <label htmlFor="email">Email: </label>
                    <input id="email" type="text" onChange={handleChange} />
                    <label htmlFor="password">Password:</label>
                    <input id="password" type="password" onChange={handleChange} />
                    <SubmitButton type="submit" />      
                </LoginForm>
            </FormContainer>
        </PageContainer>
    );
};

export default Login;