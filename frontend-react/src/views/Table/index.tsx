import React from 'react';
import { FlexGrid, Stack } from '@carbon/react';
import BCHeader from '../../components/BCHeader';

const Table = () => (
  <>
    <BCHeader />
    <FlexGrid className="mainContainer">
      <FlexGrid>
        <Stack gap={6}>
          <h2>Search</h2>
          <h2>Results</h2>
        </Stack>
      </FlexGrid>
    </FlexGrid>
  </>
);

export default Table;
