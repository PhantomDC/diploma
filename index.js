const express = require('express');
const config = require('config');
const bodyParser = require('body-parser');
const DataBase = require('./services/db');
const app = express();

// Routes

const userRouter = require('./routes/user');
const phraseRouter = require('./routes/phrase');
const searchRouter = require('./routes/search');

// Constants

const PORT = config.get('PORT');

app.use(bodyParser.json());
app.use('/api/users', userRouter);
app.use('/api/phrase', phraseRouter);
app.use('/api/search', searchRouter)

app.listen(PORT, () => {
  console.log('Server has been started on port', PORT);
});

// Pse

// for (let i = 0; i < pharaseList.length; i++) {
//   const pharase = pharaseList[i];
//   const pharaseHash = 0010010;
//   const pharaseStress = 0;

//   if (wordVowel === phraseVowel) {
//     switch (variant) {
//       case variant === 0: // Проверить хэш после ударной гласной
//         break;
//       case variant === 1: // Проверить согласную до ударной гласной
//         break;
//       case variant === 2: // pick mock
//         break;
//       case variant === 3: // Проверить на части речи
//         break;
//       case variant === 4: // Если точная и богатая - диссонанс, ассонанс - все глассные должны совпадать
//         break;
//       default: "parse error";
//     }
//   }
// }

