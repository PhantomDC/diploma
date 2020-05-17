import React, { useState, useContext } from 'react';
import {
  Box,
  Typography,
  makeStyles,
  createStyles,
  TextField,
  Button
} from '@material-ui/core';
import { useParams } from 'react-router-dom';
import { useHttp } from '../../hooks/useHttp';
import { AppContext } from '../../store/appContext';

const useStyles = makeStyles(({ spacing }) => createStyles({
  authBox: {
    display: "flex",
    height: "100vh",
    width: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  authContainer: {
    width: "100%",
    height: 300,
  },
  authForm: {
    padding: spacing(4),
    maxWidth: 420,
    margin: "0 auto"
  },
  simpleInput: {
    display: "flex",
    marginBottom: spacing(2),
  }
}))

export const AuthPage = () => {

  const { authBox, authContainer, simpleInput, authForm } = useStyles();
  const { request } = useHttp();
  const { login, showDialog } = useContext(AppContext);
  const [authData, setAuthData] = useState({ login: '', password: '' });

  const handleChange = ({ target: { name, value } }) => {
    setAuthData({
      ...authData,
      [name]: value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { status, data } = await request('/api/users/auth', 'POST', authData);
    
    if (status === 200) {
      login(data.token);
      showDialog(data.result);
      return;
    }

    showDialog("Неверный логин или пароль", true);
  }

  const inputParams = {
    className: simpleInput,
    onChange: handleChange
  }

  return (
    <Box className={ authBox }>
      <Box className={ authContainer }>
        <Typography variant="h5" align="center">Авторизация</Typography>
        <form className={ authForm } onSubmit={ handleSubmit }>
          <TextField label="Login" name="login" value={ authData.login } { ...inputParams } />
          <TextField label="Password" name="password" value={ authData.password } type="password" { ...inputParams } />
          <Button variant="contained" color="primary" type="submit">Вход</Button>
        </form>
      </Box>
    </Box>
  );
}