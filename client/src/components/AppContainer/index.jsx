import React from 'react';
import { Grid, Box } from '@material-ui/core';

export const AppContainer = ({ children }) => {
  return (
    <Grid container justify="center">
      <Grid item md={ 8 }>
        <Grid container>
          <Box width="100%" paddingTop="32px">
            { children }
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
}