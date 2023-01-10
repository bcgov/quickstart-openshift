import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeycloakLoginOptions } from 'keycloak-js';

import {
  Button,
  FlexGrid,
  Column,
  Row,
  Stack
} from '@carbon/react';
import LoginProviders from '../../types/LoginProviders';
import { useAuth } from '../../contexts/AuthContext';

const Landing = () => {
  const { startKeycloak, login, signed } = useAuth();
  const navigate = useNavigate();

  const getPageParam = (): string => {
    let page: string = '/home';
    const paramString = window.location.search.split('?')[1];
    const queryString = new URLSearchParams(paramString);
    if (queryString.has('page')) {
      page = queryString.get('page') || '/home';
    }
    return page;
  };

  const handleLogin = (provider: LoginProviders) => {
    if (signed) {
      navigate(getPageParam());
      return;
    }

    const loginOptions: KeycloakLoginOptions = {
      redirectUri: `${window.location.origin}/home`,
      idpHint: provider
    };

    login(loginOptions);
  };

  useEffect(() => {
    if (signed) {
      navigate(getPageParam());
    } else {
      startKeycloak();
    }
  }, [signed]);

  return (
    <FlexGrid className="mainContainer">
      <FlexGrid container="true" spacing={4}>
        <Stack gap={6}>
          <Row>
            <Column sm={4}>
              <Stack gap={3}>
                <h1 data-testid="home-title">NR React Sample App</h1>
                <p data-testid="home-desc">
                  Landing page
                </p>
              </Stack>
            </Column>
          </Row>
          <Row>
            <Column sm={4} md={4}>
              <Button
                onClick={() => { handleLogin(LoginProviders.IDIR); }}
                size="lg"
                data-testid="landing-button__idir"
              >
                Login with IDIR
              </Button>
              &nbsp;
              <Button
                onClick={() => { handleLogin(LoginProviders.BUSINESS_BCEID); }}
                size="lg"
                data-testid="landing-button__bceid"
              >
                Login with Business BCeID
              </Button>
            </Column>
          </Row>
        </Stack>
      </FlexGrid>
    </FlexGrid>
  );
};

export default Landing;
