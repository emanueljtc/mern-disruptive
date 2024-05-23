import express from 'express';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes';
import categoriesRoutes from './routes/categories.routes';
import permissionRotes from './routes/permissions.routes';
import contentRoutes from './routes/content.routes';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/api', categoriesRoutes);
app.use('/api', permissionRotes);
app.use('/api', contentRoutes);

export default app;

