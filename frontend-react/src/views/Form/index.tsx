import React from 'react';

import {
  Button,
  TextInput,
  InlineNotification,
  FlexGrid,
  Column,
  Row,
  Stack
} from '@carbon/react';

import LoadingButton from '../../components/LoadingButton';
import UserTable from '../../components/UserTable';

import SampleUser from '../../types/SampleUser';
import getExceptionResponse from '../../service/GetExceptionResponse';

import { fetchApiRequest, createRequestInit } from '../../service/FetchApi';

import './styles.css';
import { useAuth } from '../../contexts/AuthContext';
import BCHeader from '../../components/BCHeader';

type InputValidation = {
  EMPTY: boolean,
  INVALID: boolean,
  OK: boolean
}

const Form = () => {
  const { user, token } = useAuth();

  const BASE_URL = import.meta.env.VITE_SERVER_URL;

  const [firstName, setFirstName] = React.useState<string>('');
  const [firstFeed, setFirstFeed] = React.useState<string>('');
  const [firstInvalid, setFirstInvalid] = React.useState<InputValidation>({
    EMPTY: true,
    INVALID: false,
    OK: false
  });

  const [lastName, setLastName] = React.useState<string>('');
  const [lastFeed, setLastFeed] = React.useState<string>('');
  const [lastInvalid, setLastInvalid] = React.useState<InputValidation>({
    EMPTY: true,
    INVALID: false,
    OK: false
  });

  // Carbon's input components doesn't reset the character counter,
  // so we use a key to force a reset on the whole component
  const [inputResetKey, setInputResetKey] = React.useState<boolean>(false);

  const [showError, setShowError] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string>('');

  const [users, setUsers] = React.useState<SampleUser[]>([]);

  const [firstCharCounter, setFirstCharCounter] = React.useState<boolean>(false);
  const [lastCharCounter, setLastCharCounter] = React.useState<boolean>(false);

  const [disableElements, setDisableElements] = React.useState<boolean>(false);

  const tableHeaders: string[] = ['#', 'First name', 'Last name', 'Delete?'];
  const loadingStatus = {
    loading: 'Submitting...',
    success: 'Submitted!',
    error: 'Error'
  };

  const resetForm = (): void => {
    setInputResetKey(!inputResetKey);
    setFirstName('');
    setFirstInvalid({
      EMPTY: true,
      INVALID: false,
      OK: false
    });
    setFirstFeed('');

    setLastName('');
    setLastInvalid({
      EMPTY: true,
      INVALID: false,
      OK: false
    });
    setLastFeed('');

    setFirstCharCounter(false);
    setLastCharCounter(false);
    setDisableElements(false);
    setShowError(false);
    setErrorMessage('');
  };

  const handleError = (error: unknown): void => {
    const errorObject = getExceptionResponse(error);
    setShowError(true);
    setErrorMessage(errorObject.errorMessage);
    setDisableElements(false);

    if ('fields' in errorObject) {
      errorObject.fields.forEach((fieldException) => {
        if (fieldException.fieldName === 'firstName') {
          setFirstFeed(fieldException.fieldMessage);
          setFirstInvalid({
            EMPTY: true,
            INVALID: false,
            OK: false
          });
        } else if (fieldException.fieldName === 'lastName') {
          setLastFeed(fieldException.fieldMessage);
          setLastInvalid({
            EMPTY: true,
            INVALID: false,
            OK: false
          });
        }
      });
    }
  };

  const fetchData = async () => {
    try {
      const initObj = createRequestInit({
        method: 'GET',
        kcToken: token
      });

      const result: SampleUser[] = await fetchApiRequest<SampleUser[]>(`${BASE_URL}/api/users/find-all`, initObj);
      setUsers(result);
    } catch (error) {
      handleError(error);
    }
  };

  const saveUser = async (first: string, last: string) => {
    const body = JSON.stringify({
      firstName: first,
      lastName: last
    });

    try {
      setDisableElements(true);

      const initObj = createRequestInit({
        method: 'POST',
        kcToken: token,
        postBody: body
      });

      await fetchApiRequest(`${BASE_URL}/api/users`, initObj);
      resetForm();
      fetchData();
      return true;
    } catch (error) {
      handleError(error);
      return false;
    }
  };

  const deleteUser = async (first: string, last: string) => {
    try {
      const initObj = createRequestInit({
        method: 'DELETE',
        kcToken: token
      });

      await fetchApiRequest(`${BASE_URL}/api/users/${first}/${last}`, initObj);
      fetchData();
      return true;
    } catch (error) {
      handleError(error);
      return false;
    }
  };

  const setFirst = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setFirstName(event.target.value.trim());
  };

  const handleFirstName = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const entry = event.target.value;
    if (entry === '') {
      setFirstInvalid({
        EMPTY: true,
        INVALID: true,
        OK: false
      });
      setFirstFeed('Please enter a valid value');
    } else if (entry.length < 2) {
      setFirstInvalid({
        EMPTY: false,
        INVALID: true,
        OK: false
      });
      setFirstFeed('The first name must have at least 2 characters');
    } else {
      setFirstInvalid({
        EMPTY: false,
        INVALID: false,
        OK: true
      });
      setFirstFeed('');
    }
  };

  const setLast = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setLastName(event.target.value.trim());
  };

  const handleLastName = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const entry = event.target.value;
    if (entry === '') {
      setLastInvalid({
        EMPTY: true,
        INVALID: true,
        OK: false
      });
      setLastFeed('Please enter a valid value');
    } else if (entry.length < 2) {
      setLastInvalid({
        EMPTY: false,
        INVALID: true,
        OK: false
      });
      setLastFeed('The last name must have at least 2 characters');
    } else {
      setLastInvalid({
        EMPTY: false,
        INVALID: false,
        OK: true
      });
      setLastFeed('');
    }
  };

  const handleSubmit = async (): Promise<boolean> => {
    let message = '';

    if ((firstInvalid.INVALID && lastInvalid.INVALID)
        || (firstInvalid.EMPTY && lastInvalid.EMPTY)) {
      message = 'Please, enter your first and last name!';
    } else if (firstInvalid.INVALID || firstInvalid.EMPTY) {
      message = 'Please, enter your first name!';
    } else if (lastInvalid.INVALID || lastInvalid.EMPTY) {
      message = 'Please, enter your last name!';
    }

    setShowError(message !== '');
    setErrorMessage(message);

    if (message === '') {
      return saveUser(firstName, lastName);
    }
    return false;
  };

  const deleteByIndex = async (idx: number): Promise<boolean> => {
    const userToDelete = users[idx];
    return deleteUser(userToDelete.firstName, userToDelete.lastName);
  };

  const hasWriteRole = (): boolean => {
    if ('roles' in user) {
      return user.roles.includes('user_write');
    }
    return false;
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <BCHeader />
      <FlexGrid className="mainContainer">
        <FlexGrid>
          <Stack gap={6}>
            <Row>
              <Column sm={4}>
                <Stack gap={3}>
                  <h1 data-testid="form-title">NR Front End Form</h1>
                  <p data-testid="form-desc">
                    This is a test form. Please, fill your first and last name then hit Submit!
                  </p>
                </Stack>
              </Column>
            </Row>
            <Row>
              <Column sm={4}>
                {
                  showError && (
                    <InlineNotification
                      id="error-banner"
                      kind="error"
                      title="Error"
                      subtitle={errorMessage}
                      role="alert"
                      lowContrast
                    />
                  )
                }
              </Column>
            </Row>
            {hasWriteRole() && (
              <>
                <Row>
                  <Column sm={4} md={4}>
                    <TextInput
                      id="input-first"
                      key={inputResetKey}
                      invalidText={firstFeed}
                      labelText="First name"
                      placeholder="Please put your first name here"
                      invalid={firstInvalid.INVALID}
                      maxCount={20}
                      enableCounter={firstCharCounter}
                      value={firstName}
                      onBlur={handleFirstName}
                      onChange={setFirst}
                      onFocus={() => { setFirstCharCounter(true); }}
                      disabled={disableElements}
                      data-testid="input-first"
                    />
                  </Column>
                  <Column sm={4} md={4}>
                    <TextInput
                      id="input-last"
                      key={inputResetKey}
                      invalidText={lastFeed}
                      labelText="Last name"
                      placeholder="Please put your last name here"
                      invalid={lastInvalid.INVALID}
                      maxCount={20}
                      enableCounter={lastCharCounter}
                      value={lastName}
                      onBlur={handleLastName}
                      onChange={setLast}
                      onFocus={() => { setLastCharCounter(true); }}
                      disabled={disableElements}
                      data-testid="input-last"
                    />
                  </Column>
                </Row>
                <Row>
                  <Column className="buttonsColumn" sm={4}>
                    <Button
                      id="button-reset"
                      onClick={resetForm}
                      kind="tertiary"
                      size="md"
                      disabled={disableElements}
                      data-testid="button-reset"
                    >
                      Reset
                    </Button>
                    <LoadingButton
                      id="submit"
                      clickFn={handleSubmit}
                      label="Submit"
                      status={loadingStatus}
                    />
                  </Column>
                </Row>
              </>
            )}
            <Row>
              <Column sm={4}>
                <UserTable elements={users} deleteFn={deleteByIndex} headers={tableHeaders} />
              </Column>
            </Row>
          </Stack>
        </FlexGrid>
      </FlexGrid>
    </>
  );
};

export default Form;
