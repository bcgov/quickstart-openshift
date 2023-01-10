/* eslint-disable no-undef */
import { render } from '@testing-library/react';
import React from 'react';
import renderer from 'react-test-renderer';
import LoadingButton from '../../components/LoadingButton';

describe('the LoadingButton component', () => {
  const loadingStatus = {
    loading: 'Loading...',
    success: 'Finished!',
    error: 'Error'
  };

  it('should have the correct name', () => {
    const { getByTestId } = render(
      <LoadingButton
        id="test"
        clickFn={() => {}}
        label="Submit"
        status={loadingStatus}
      />
    );
    expect(getByTestId('button-test').textContent).toBe('Submit');
  });

  it('should match the snapshot', () => {
    const tree = renderer
      .create(
        <LoadingButton
          id="test"
          clickFn={() => {}}
          label="Submit"
          status={loadingStatus}
        />
      ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
