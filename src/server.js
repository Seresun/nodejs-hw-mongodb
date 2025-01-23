import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import contactsRouter from './routes/contacts.js';

const setupServer = () => {
  const app = express();

  const PORT = process.env.PORT || 3000;

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    })
  );

  app.use(cors());

  // Маршрут для корневого URL
  app.get('/', (req, res) => {
    res.send('Welcome to the API! Use /contacts for contact-related endpoints.');
  });

  // Основной роутер для /contacts
  app.use('/contacts', contactsRouter);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

export default setupServer;
