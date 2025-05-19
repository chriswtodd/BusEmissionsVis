import React, { ReactNode } from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../components/authProvider.tsx';

const ProtectedRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user } = useAuth();

    return (
        <React.Suspense fallback={<div>404: This bus cannot be found!</div>} >
            {user !== null ? children : <Navigate to="/login" /> }
        </React.Suspense>
    );
  };
  
  export default ProtectedRoute;