import React, { ReactNode } from 'react';
import { useDispatch } from 'react-redux';
import { Navigate } from 'react-router';
import { useAuth } from '../components/authProvider.tsx';


const ProtectedRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
    const dispatch = useDispatch();
    const { authInfo } = useAuth();
    
    const userAuthorised = authInfo?.userInfo !== null;

    return (
        <React.Suspense fallback={<div>404: This bus cannot be found!</div>} >
            { userAuthorised ? children : <Navigate to="/" state={{ authFailure: true }}/> }
        </React.Suspense>
    );
  };
  
  export default ProtectedRoute;