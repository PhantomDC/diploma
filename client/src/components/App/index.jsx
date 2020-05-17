import React from 'react';
import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { BrowserRouter as Router } from 'react-router-dom';
import { useRouter } from '../../hooks/useRouter';
import { useAuth } from '../../hooks/useAuth';
import { useDialog } from '../../hooks/useDialog';
import { AppContainer } from '../AppContainer';
import { AppContext } from '../../store/appContext';

function App() {

  const { token, login, logout } = useAuth();
  const { show, clear, dialog, isError } = useDialog();
  const routes = useRouter(!!token);

  return (
    <AppContext.Provider value={ { token, login, logout, showDialog: show } }>
      <Router>
        <AppContainer>
          { routes }
        </AppContainer>
      </Router>
      <Snackbar open={ !!dialog } autoHideDuration={ 6000 } onClose={ clear }>
        <Alert severity={ isError ? "error" : "success" }>
          { dialog }
        </Alert>
      </Snackbar>
    </AppContext.Provider>
  );
}

export default App;
