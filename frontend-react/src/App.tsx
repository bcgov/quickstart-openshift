/* eslint-disable no-console */
import React from 'react';
import {
  BrowserRouter, Routes, Route
} from 'react-router-dom';

import './custom.scss';

import Landing from './views/Landing';
import Form from './views/Form';
import Table from './views/Table';
import Home from './views/Home';
import ProtectedRoute from './routes/ProtectedRoute';
import { useAuth } from './contexts/AuthContext';
import SilentCheckSso from './components/SilentCheckSso';
import Logout from './components/Logout';

/**
 * Create an app structure conaining all the routes.
 *
 * @returns {JSX.Element} instance of the app ready to use.
 */
const App: React.FC = () => {
  const { signed } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/silent-check-sso" element={<SilentCheckSso />} />
        <Route path="/logout" element={<Logout />} />

        <Route
          path="/home"
          element={(
            <ProtectedRoute signed={signed}>
              <Home />
            </ProtectedRoute>
          )}
        />

        <Route
          path="/form"
          element={(
            <ProtectedRoute signed={signed}>
              <Form />
            </ProtectedRoute>
          )}
        />

        <Route
          path="/table"
          element={(
            <ProtectedRoute signed={signed}>
              <Table />
            </ProtectedRoute>
          )}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
