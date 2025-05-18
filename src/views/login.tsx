import { useState } from "react";
import { useNavigate } from "react-router";
import { useLoginMutation } from "../react-query/createSessionApi.js";
import { ILoginCredentials } from "../models/loginModel.tsx"

const Login = () => {
    const [login, { data: loginData, isLoading: il, error: e }] = useLoginMutation();

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
        await login({ body: formData }).unwrap();   // Make the API call
        alert(loginData?.msg);
        // http cookies
        localStorage.setItem("token", loginData?.token);
        localStorage.setItem("role", loginData?.role);
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
        </form>
    </div>
    );
};

export default Login;