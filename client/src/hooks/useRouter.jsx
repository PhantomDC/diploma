import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

// Pages

import { MainPage } from '../pages/main';
import { AuthPage } from '../pages/auth';
import { ListPage } from '../pages/list';
import { AddPage } from '../pages/add';
import { EditPage } from '../pages/edit';

export const useRouter = (isAuth) => {

  if (!isAuth) {
    return (
      <Switch>
        <Route path="/" exact>
          <MainPage />
        </Route>
        <Route path='/login'>
          <AuthPage />
        </Route>
        <Redirect to='/' />
      </Switch>
    );
  }

  return (
    <Switch>
      <Route path="/" exact>
        <MainPage />
      </Route>
      <Route path='/admin/list' exact>
        <ListPage />
      </Route>
      <Route path='/admin/list/:id' exact>
        <EditPage />
      </Route>
      <Route path='/admin/add' exact>
        <AddPage />
      </Route>
      <Redirect to='/admin/list' />
    </Switch>
  )
}