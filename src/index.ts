import cors from 'cors';
import express from 'express';

import { clientsRouter } from './routes/clients';
import { PORT, pool } from './utils/config';

pool
  .connect()
  .then(() => {
    console.log('Conectado ao banco de dados!');

    const app = express();
    app.use(express.json());
    app.use(cors());
    app.use(clientsRouter);

    app.listen(PORT, () => {
      console.log(`🚀 Servidor executando em http://localhost:${PORT}`);
    });
  })
  .catch((err: unknown) => {
    let errorMessage = 'Erro ao conectar ao banco de dados.';
    if (err instanceof Error) {
      errorMessage += ' Error: ' + err.message;
    }
    console.error(errorMessage);
  });
