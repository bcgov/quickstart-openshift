import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import BCHeader from '../../components/BCHeader';

describe('the Header component', () => {
  it('should have the correct title', () => {
    const { getByTestId } = render(
      <BrowserRouter>
        <BCHeader />
      </BrowserRouter>
    );

    expect(getByTestId('header-name').textContent).toBe("BC Gov's NR Sample App");
  });
});
