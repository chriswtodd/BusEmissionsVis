import React, { createContext, useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import Cookies from "js-cookie";

interface ProviderProps {
    accessToken:  string | null,
    token:  string | null
}

const AuthContext = createContext<ProviderProps>({
    accessToken: null,
    token: null
})

const AuthProvider = ({ children }: { children: React.ReactNode}) => {
    const [token, setToken] = useState(Cookies.get("refreshToken") || '');

    const accessToken = useSelector(state => state);
    console.log(accessToken)

    return (
        <AuthContext.Provider value={{ accessToken, token }}>
            { children }
        </AuthContext.Provider>
    )
}

export default AuthProvider

export const useAuth = () => {
    return useContext(AuthContext)
}