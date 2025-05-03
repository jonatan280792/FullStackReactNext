import React from 'react';
import { Navigate } from 'react-router-dom';
import { sessionPersistence } from '@/app/utils/sessionService';

interface PrivateRouteProps {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const token = sessionPersistence.get('token');

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
