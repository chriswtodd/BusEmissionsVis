import React, { createContext, useContext, useState } from 'react';

interface ProviderProps {
    user:  string | null,
    token:  string
}

const AuthContext = createContext<ProviderProps>({
    user: null,
    token: ''
})

const AuthProvider = ({ children }: { children: React.ReactNode}) => {
    console.log(localStorage)
    const [user, setUser] = useState<string | null>(localStorage.getItem("role") || null);
    const [token, setToken] = useState( localStorage.getItem("token") || '');

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