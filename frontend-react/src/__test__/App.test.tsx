/* eslint-disable no-undef */
import React from 'react';
import { render } from '@testing-library/react';
import App from '../App';
import { AuthProvider } from '../contexts/AuthContext';

// https://dev.to/mbarzeev/from-jest-to-vitest-migration-and-benchmark-23pl
// https://github.com/vitest-dev/vitest/blob/main/examples/react-testing-lib/src/utils/test-utils.tsx

describe('Renders App', () => {
  it('the title is visible', () => {
    render(
      <AuthProvider>
        <App />
      </AuthProvider>
    );
  });
});
