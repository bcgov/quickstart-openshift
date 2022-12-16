import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import renderer from 'react-test-renderer';
import { assert, describe, expect, it } from 'vitest';
import BCHeader from '../../components/BCHeader';
import { AuthProvider } from '../../contexts/AuthContext';

describe('the Header component', () => {
  it('should have the correct title', () => {
    const { getByTestId } = render(
      <BrowserRouter>
        <AuthProvider>
          <BCHeader />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(getByTestId('header-name').textContent).toBe("BC Gov's NR Sample App");
  });

  it('should match the snapshot', () => {
    const tree = renderer
      .create(
        <BrowserRouter>
          <AuthProvider>
            <BCHeader />
          </AuthProvider>
        </BrowserRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
