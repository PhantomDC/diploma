import { createContext } from 'react';

const noope = function () { }

export const AppContext = createContext({
  login: noope,
  logout: noope,
  isAuth: false,
  token: "",
  showDialog: noope,
  clear: noope,
  dialog: "",
  isError: false
});