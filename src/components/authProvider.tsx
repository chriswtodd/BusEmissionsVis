import React, { createContext, useContext } from 'react';
import { useSelector } from 'react-redux';
import { IAuth } from '../models/loginModel';

interface ProviderProps {
    authInfo:  IAuth | null
}

const AuthContext = createContext<ProviderProps>({
    authInfo: null,
})

const AuthProvider = ({ children }: { children: React.ReactNode}) => {
    const authInfo = useSelector(state => state.auth);

    return (
        <AuthContext.Provider value={{ authInfo: authInfo }}>
            { children }
        </AuthContext.Provider>
    )
}

export default AuthProvider

export const useAuth = () => {
    return useContext(AuthContext)
}