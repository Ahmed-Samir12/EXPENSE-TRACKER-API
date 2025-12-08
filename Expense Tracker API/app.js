import express from 'express';
import ExpenseRouter from './routes/expenseRoutes.js';

const app = express();

app.use(express.json());

app.use('/api/v1/expenses', ExpenseRouter);

export default app;
