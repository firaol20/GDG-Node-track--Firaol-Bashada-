import express from 'express';
import morgan from 'morgan';
import bookRoutes from './src/routes/bookRoutes.js';

const app = express();

//Global Middlewares
app.use(express.json());
app.use(morgan('dev'));

app.use('/books', bookRoutes);

export default app;

