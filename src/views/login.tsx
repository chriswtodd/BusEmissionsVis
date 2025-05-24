import { useState } from "react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { useLoginMutation } from "../react-query/createSessionApi.js";
import { ILoginCredentials } from "../models/loginModel.tsx"
import Cookies from "js-cookie";

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
        <div className="container">
            <div className="title">Login</div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email: </label>
                <input id="email" type="text" onChange={handleChange} />
                <label htmlFor="password">Password:</label>
                <input id="password" type="text" onChange={handleChange} />
                <input type="submit" />      
            </form>
        </div>
    );
};

export default Login;