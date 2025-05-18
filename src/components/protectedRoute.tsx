import React, { ReactNode, useMemo } from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../components/authProvider.tsx';

const ProtectedRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const AllRoutes = useMemo(
      () => React.lazy(() => import("../views/home.jsx")),
      []
    );
  
    return (
        <React.Suspense fallback={<div>404: This bus cannot be found!</div>}>
            <AllRoutes>
                {user !== null ? children : <Navigate to="/login" />}
            </AllRoutes>
        </React.Suspense>
    );
  };
  
  export default ProtectedRoute;