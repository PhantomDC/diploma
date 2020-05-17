import React, { useState, useEffect, useContext } from 'react';
import {
  Typography,
  Box,
  TextField,
  Button,
  Select,
  InputLabel,
  FormControl,
  MenuItem,
  Divider,
  makeStyles,
  createStyles
} from '@material-ui/core';
import renderHTML from 'react-render-html';
import { useHttp } from '../../hooks/useHttp';
import { useHistory, useParams } from 'react-router-dom';
import { AppContainer } from '../../components/AppContainer';
import { AppContext } from '../../store/appContext';

import { getPhraseWithStress } from '../../helpers';

const useStyles = makeStyles(({ spacing }) => createStyles({
  form: {
    marginTop: spacing(4),
    display: 'flex'
  },
  customField: {
    width: '100%'
  },
  phraseContainer: {
    marginTop: spacing(3),
    display: "flex",
    flexWrap: "wrap"
  },
  word: {
    marginRight: spacing(2),
    marginBottom: spacing(2),
    '&:last-child': {
      marginRight: 0
    },
    "& > button": {
      marginTop: spacing(1),
    }
  },
  select: {
    flexBasis: '40%',
    marginLeft: spacing(2)
  },
  divider: {
    margin: `${spacing(4)}px 0 ${spacing(4)}px 0`
  },
  submitBtn: {
    marginTop: spacing(4),
    marginRight: spacing(2),
    "&:last-child": {
      marginRight: 0
    }
  }
}));

export const EditPage = () => {

  const { form, customField, phraseContainer, word: wordStyle, select, divider, submitBtn } = useStyles();
  const { request } = useHttp();
  const { token, showDialog } = useContext(AppContext);
  const history = useHistory();
  const params = useParams();
  const [phrase, setPhrase] = useState('');
  const [stress, setStress] = useState(0);
  const [parts, setParts] = useState([]);
  const [selectedPart, setSelectedPart] = useState('');

  const authHeader = {
    authorization: `Bearer ${token}`
  };

  useEffect(() => {
    (async () => {
      const { id } = params;

      const response = await request(`/api/phrase/get/${id}`, 'POST', {}, authHeader);

      if (response.status !== 200 || !response.data.data.length) {
        showDialog('Не удалось получить фразу с таким id', true);
        history.push('/admin/list');
        return;
      }

      const { searchWord, stressIndex, part } = response.data.data[0];
      setPhrase(searchWord);
      setStress(stressIndex);
      setSelectedPart(part);
    })()
  }, [])

  useEffect(() => {
    (async () => {
      const response = await request('/api/phrase/parts', 'POST', {}, authHeader);
      if (response.status === 200) {
        setParts(response.data.data);
      }
    })()
  }, [])

  const handleChange = ({ target: { value } }) => {
    setPhrase(value.trim())
  }

  const handleChangeStress = (ind) => {
    setStress(ind);
  }

  const handleChangePart = ({ target: { value } }) => {
    setSelectedPart(value);
  }

  const handleSubmit = async () => {
    const data = {
      searchWord: phrase,
      stressIndex: stress,
      part: selectedPart
    }

    const { id } = params;

    try {
      const response = await request(`/api/phrase/update/${id}`, 'POST', data, authHeader);
      if (response.status === 200) {
        showDialog("Фраза обновлена");
        history.push('/admin/list');
        return;
      }

      showDialog("Что-то, хз что, пошло не так :-)", true);
    } catch (e) {
      showDialog("Что-то, хз что, пошло не так :-)", true);
    }
  }

  const handleDelete = async () => {

    const { id } = params;

    try {
      const response = await request(`/api/phrase/delete/${id}`, 'POST', {}, authHeader);
      if (response.status === 200) {
        showDialog("Фраза удалена");
        history.push('/admin/list');
        return;
      }

      showDialog("Что-то, хз что, пошло не так :-)", true);
    } catch (e) {
      showDialog("Что-то, хз что, пошло не так :-)", true);
    }
  }

  const renderPhrase = () => {
    return phrase && phrase.split('').map((word, ind) => (
      <Box align="center" className={ wordStyle } key={ `W-${ind}` }>
        <Typography variant="h4">{ word }</Typography>
        <Button
          onClick={ () => handleChangeStress(ind) }
          color={ ind === stress ? 'secondary' : 'default' }
          variant="contained"
        >
          |
          </Button>
      </Box>
    ));
  }

  return (
    <AppContainer>
      <Box>
        <Typography variant="h5" align="center">Новая фраза</Typography>
        <form className={ form }>
          <TextField label="Фраза" className={ customField } value={ phrase } onChange={ handleChange } />
          <FormControl className={ select }>
            <InputLabel>Часть речи</InputLabel>
            <Select onChange={ handleChangePart } value={ selectedPart }>
              { !!parts.length &&
                parts.map(({ prefix, name }) => (
                  <MenuItem key={ prefix } value={ prefix }>{ name }</MenuItem>
                ))
              }
            </Select>
          </FormControl>

        </form>
        <Box className={ phraseContainer }>
          { renderPhrase() }
        </Box>

        { !!phrase && <Divider className={ divider } /> }

        { !!phrase && (
          <>
            <Typography variant="h4">{
              renderHTML(getPhraseWithStress(phrase, stress)) }
            </Typography>
            <Button
              onClick={ handleSubmit }
              variant="contained"
              color="primary"
              className={ submitBtn }
            >
              Сохранить
              </Button>
            <Button
              onClick={ handleDelete }
              variant="contained"
              color="secondary"
              className={ submitBtn }
            >
              Удалить
              </Button>
          </>
        ) }
      </Box>
    </AppContainer>
  );
}