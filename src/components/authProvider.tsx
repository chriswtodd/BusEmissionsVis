import React, { createContext, useContext, useState } from 'react';
import Cookies from "js-cookie";

interface ProviderProps {
    user:  string | null,
    token:  string
}

const AuthContext = createContext<ProviderProps>({
    user: null,
    token: ''
})

const AuthProvider = ({ children }: { children: React.ReactNode}) => {
    console.log(Cookies.get())
    const [user, setUser] = useState<string | null>(Cookies.get("role") || null);
    const [token, setToken] = useState(Cookies.get("token") || '');

    return (
        <AuthContext.Provider value={{ user, token }}>
            { children }
        </AuthContext.Provider>
    )
}

export default AuthProvider

export const useAuth = () => {
    return useContext(AuthContext)
}