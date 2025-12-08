import express from 'express';
import * as ExpenseController from '../controllers/expenseController.js';

const router = express.Router();

router.route('/stats/summary').get(ExpenseController.getStats);
router.route('/stats/monthly').get(ExpenseController.monthlyStats);

router
  .route('/')
  .get(ExpenseController.getAllExpenses)
  .post(ExpenseController.createExpense);

router
  .route('/:id')
  .get(ExpenseController.getExpense)
  .patch(ExpenseController.updateExpense)
  .delete(ExpenseController.deleteExpense);

export default router;
