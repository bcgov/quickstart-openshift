import React from 'react';

import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell
} from '@carbon/react';
import { TrashCan } from '@carbon/icons-react';

import LoadingButton from '../LoadingButton';
import SampleUser from '../../types/SampleUser';
import { useAuth } from '../../contexts/AuthContext';

interface TableProps {
  elements: SampleUser[],
  deleteFn: Function,
  headers: string[]
}

const UserTable = ({ elements, deleteFn, headers }: TableProps) => {
  const { user } = useAuth();

  const loadingStatus = {
    loading: 'Deleting...',
    success: 'Deleted!',
    error: 'Error'
  };

  const hasWriteRole = (): boolean => {
    if ('roles' in user) {
      // 'user_write' is the name of the required rule
      return user.roles.includes('user_write');
    }
    return false;
  };

  const hashObject = (str: string): number => {
    return str.split('').reduce((s, c) => Math.imul(31, s) + c.charCodeAt(0) | 0, 0);
  };

  return (
    <Table size="lg" useZebraStyles={false}>
      <TableHead>
        <TableRow>
          {headers.map((header, idx) => (
            <TableHeader key={header} id={`header-${header}-${idx}`} data-testid={`header-${header}-${idx}`}>
              {header}
            </TableHeader>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {elements.map((item, idx) => (
          <TableRow key={hashObject(JSON.stringify(item))} id={`row${idx}`}>
            <TableCell>{idx}</TableCell>
            <TableCell>{item.firstName}</TableCell>
            <TableCell>{item.lastName}</TableCell>
            <TableCell>
              {!hasWriteRole()
                ? 'Some Text' : (
                  <LoadingButton
                    id={`delete-${idx}`}
                    clickFn={() => deleteFn(idx)}
                    label="Delete"
                    status={loadingStatus}
                    icon={TrashCan}
                  />
                )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UserTable;
