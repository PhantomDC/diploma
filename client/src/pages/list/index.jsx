import React, { useEffect, useState, useContext } from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  TableContainer,
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
  Link as A,
  makeStyles,
  createStyles
} from '@material-ui/core';
import renderHTML from 'react-render-html';
import { Link, useHistory } from 'react-router-dom';
import { AppContainer } from '../../components/AppContainer';
import { useHttp } from '../../hooks/useHttp';
import { AppContext } from '../../store/appContext';

import { getPhraseWithStress } from '../../helpers';

const useStyles = makeStyles(({ spacing }) => createStyles({
  table: {
    marginTop: spacing(5)
  }
}))

export const ListPage = () => {

  const { request } = useHttp();
  const { table } = useStyles();
  const { token } = useContext(AppContext);
  const history = useHistory();
  const [data, setData] = useState([]);
  const [parts, setParts] = useState([]);

  const heading = ["Фраза", "Часть речи", "Редактировать"];
  const authHeader = {
    authorization: `Bearer ${token}`
  };

  useEffect(() => {

    (async () => {
      const response = await request('/api/phrase/get/', 'POST', {}, authHeader);
      const responseParts = await request('/api/phrase/parts', 'POST', {}, authHeader);
      if (response.status === 200 && responseParts.status === 200) {
        setData(response.data.data);
        setParts(responseParts.data.data);
      }
    })();

  }, []);

  const renderBody = () => (
    data.map(item => {
      const realPart = parts.filter(part => part.prefix === item.part)[0];

      return (
        <TableRow key={ item._id }>
          <TableCell>{ renderHTML(getPhraseWithStress(item.searchWord, item.stressIndex)) }</TableCell>
          <TableCell align="right">{ realPart && realPart.name }</TableCell>
          <TableCell align="right">
            <A component={ Link } to={ `/admin/list/${item._id}` }>
              <Button color='secondary'>Edit</Button>
            </A>
          </TableCell>
        </TableRow>
      )
    })
  );

  return (
    <AppContainer>
      <Box>
        <Typography variant="h5" align="center">Список фраз</Typography>
        <Box className={ table }>
          <Button variant="contained" color="secondary" onClick={ () => history.push('/admin/add') }>
            Создать
          </Button>
        </Box>
        <TableContainer component={ Paper } className={ table }>
          <Table>
            <TableHead>
              <TableRow>
                { heading.map((head, ind) => (
                  <TableCell key={ `Head-${ind}` } align={ ind > 0 ? "right" : "left" }>{ head }</TableCell>
                )) }
              </TableRow>
            </TableHead>
            <TableBody>
              { renderBody() }
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </AppContainer>
  );
}