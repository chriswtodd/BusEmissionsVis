import React, { ReactNode } from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../components/authProvider.tsx';

const ProtectedRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { accessToken } = useAuth();

    return (
        <React.Suspense fallback={<div>404: This bus cannot be found!</div>} >
            {accessToken !== null ? children : <Navigate to="/login" /> }
        </React.Suspense>
    );
  };
  
  export default ProtectedRoute;