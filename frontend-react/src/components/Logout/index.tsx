import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Logout = () => {
  const { logout, signed } = useAuth();

  if (signed) {
    logout()
      .then(() => <Navigate to="/" />);
  } else {
    return <Navigate to="/" />;
  }

  return (
    <>
    </>
  );
};

export default Logout;
