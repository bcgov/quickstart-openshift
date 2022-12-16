import React from 'react';
import { Navigate } from 'react-router-dom';

interface IProps {
  signed: boolean;
  children: JSX.Element;
}

const ProtectedRoute = ({ signed, children }: IProps): JSX.Element => {
  if (!signed) {
    const { pathname } = window.location;
    const encodedUrl = encodeURI(`/?page=${pathname}`);
    return <Navigate to={encodedUrl} replace />;
  }

  return children;
};

export default ProtectedRoute;
