import React, { useState, useEffect } from 'react';
import renderHTML from 'react-render-html';
import {
  Typography,
  Box,
  TextField,
  makeStyles,
  createStyles,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { AppContainer } from '../../components/AppContainer';
import { useHttp } from '../../hooks/useHttp';

import { getPhraseWithStress, getRhymeById, getPartByPrefix } from '../../helpers';

const useStyles = makeStyles(({ spacing, typography }) => createStyles({
  searchForm: {
    marginTop: spacing(2),
    display: 'flex'
  },
  searchInp: {
    width: '100%'
  },
  searchResult: {
    margin: `${spacing(7)}px 0`,
  },
  selectRhyme: {
    width: '30%'
  },
  divider: {
    margin: `${spacing(4)}px 0`
  },
  cardRhyme: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: spacing(1),
  },
  searchCard: {
    marginBottom: spacing(2),
  },
  expandedHeader: {
    fontSize: typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  }
}));

export const MainPage = () => {

  const { searchForm, searchInp, cardRhyme, selectRhyme, searchResult, searchCard, expandedHeader } = useStyles();
  const { request } = useHttp();
  const [rhymes, setRhymes] = useState([]);
  const [searchWord, setSearchWord] = useState('');
  const [currentRhyme, setCurrentRhyme] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [data, setData] = useState([]);
  const [parts, setParts] = useState([]);


  useEffect(() => {
    (async () => {
      const response = await request('/api/search/getVariants', 'POST', {}, {});
      const responseParts = await request('/api/search/getParts', 'POST', {}, {});

      setParts(responseParts && responseParts.data.data);
      setRhymes(response.data.data);
    })()
  }, []);

  useEffect(() => {
    (async () => {
      if (searchWord.length > 2 && currentRhyme.length) {
        const response = await request('/api/search/searchRhyme', 'POST', {
          searchWord,
          rhymeList: currentRhyme,
        });
        setData(response.data && response.data.data || []);
      }
    })()
  }, [searchWord, currentRhyme]);


  const handleChangeRhyme = ({ target: { value } }) => {
    setCurrentRhyme(value);
  }

  const handleSearchWord = ({ target: { value } }) => {
    setSearchWord(value);
  }

  const handleExpanded = (panel) => (e, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  }

  return (
    <AppContainer>
      <Box>
        <Typography variant="h5" align="center">Поиск рифм</Typography>
        <form className={ searchForm }>
          <TextField label="Поиск" className={ searchInp } value={ searchWord } onChange={ handleSearchWord } />
          <FormControl className={ selectRhyme }>
            <InputLabel>Тип рифмы</InputLabel>
            <Select multiple value={ currentRhyme } onChange={ handleChangeRhyme }>
              { rhymes.length && rhymes.map(r => <MenuItem key={ r.id } value={ r.id }>{ r.name }</MenuItem>) }
            </Select>
          </FormControl>
        </form>
        <Box className={ searchResult }>
          { data.map(d =>
            <Card variant="outlined" className={ searchCard }>
              <CardContent>
                <Typography variant="h5" component="h2">
                  { renderHTML(getPhraseWithStress(d.phrase.searchWord, d.phrase.stressIndex)) }
                </Typography>
                <Box className={ cardRhyme }>
                  <Typography color="textSecondary">{ getPartByPrefix(d.phrase.part, parts) }</Typography>
                  <Typography color="textSecondary">{ getRhymeById(d.rhyme, rhymes) }</Typography>
                </Box>
              </CardContent>
            </Card>
          ) }
          { !data.length && <Typography variant="h6" style={ { marginBottom: '12px' } }>Ничего не найдено</Typography> }
        </Box>
        { rhymes.filter(r => currentRhyme.includes(r.id)).length > 0 &&
          <Typography variant="h6" style={ { marginBottom: '12px' } }>Теоретические сведения</Typography>
        }
        { rhymes.filter(r => currentRhyme.includes(r.id)).map(r =>
          <ExpansionPanel expanded={ expanded === r.id } onChange={ handleExpanded(r.id) }>
            <ExpansionPanelSummary
              expandIcon={ <ExpandMoreIcon /> }
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <Typography className={ expandedHeader }>{ r.name }</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Typography>
                { r.description }
              </Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        ) }
      </Box>
    </AppContainer>
  );
}