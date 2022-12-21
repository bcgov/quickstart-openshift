import React from 'react';

import {
  Button,
  Header,
  HeaderGlobalBar,
  HeaderGlobalAction,
  Theme
} from '@carbon/react';
import {
  Search,
  Notification,
  Switcher
} from '@carbon/icons-react';
import { Link, useNavigate } from 'react-router-dom';
import './styles.css';

const BCHeader = () => {
  const navigate = useNavigate();

  const goOut = () => {
    navigate('/logout');
  };

  return (
    <Theme theme="g100">
      <Header aria-label="BC Gov's NR Sample App" data-testid="header">
        <Link to="/home" className="header-link" data-testid="header-name">
          BC Gov&apos;s NR Sample App
        </Link>
        <HeaderGlobalBar>
          <Button
            onClick={() => goOut()}
            size="sm"
          >
            Logout
          </Button>
          <HeaderGlobalAction
            aria-label="Search"
            tooltipAlignment="end"
            data-testid="header-button__search"
          >
            <Search size={20}
          />
          </HeaderGlobalAction>
          <HeaderGlobalAction
            aria-label="Notifications"
            tooltipAlignment="end"
            data-testid="header-button__notifications"
          >
            <Notification size={20} />
          </HeaderGlobalAction>
          <HeaderGlobalAction
            aria-label="App Switcher"
            tooltipAlignment="end"
            data-testid="header-button__switcher"
          >
            <Switcher size={20} />
          </HeaderGlobalAction>
        </HeaderGlobalBar>
      </Header>
    </Theme>
  );
};

export default BCHeader;
