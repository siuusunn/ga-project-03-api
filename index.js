import express from 'express';
import cors from 'cors';
import { connectDb } from './db/helpers.js';
import { PORT } from './config/environment.js';

const app = express();
app.use(express.json());
app.use(cors());

async function startServer() {
  try {
    connectDb();
    console.log('Connected to mongodb 🤖');
    app.listen(PORT, () => console.log(`Up and running on port ${PORT}`));
  } catch (err) {
    console.log('Oops, ERROR 🤖', err);
  }
}
startServer();
