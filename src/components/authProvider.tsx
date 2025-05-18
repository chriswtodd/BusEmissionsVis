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
    const storedInfo =  localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') || '{}') : null;
    const [user, setUser] = useState<string | null>(storedInfo?.email);
    const [token, setToken] = useState( storedInfo?.token || '');

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