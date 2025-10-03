import express from 'express';
import { sessionAuth } from '../../middleware/sessionAuth.js';
import { emailVerified } from '../../middleware/emailVerified.js';
import { validate } from '../../middleware/validatorMiddleware.js';
import { budgetSchema } from '../../validations/validatorSchema.js';
import { listBudgets, renderCreate, createBudget, renderEdit, updateBudget, deleteBudget } from '../../controllers/budgetController.js';

const router = express.Router();

router.get('/budgets', sessionAuth, emailVerified, listBudgets);
router.get('/budgets/new', sessionAuth, emailVerified, renderCreate);
router.post('/budgets', sessionAuth, emailVerified, validate(budgetSchema), createBudget);
router.get('/budgets/:id/edit', sessionAuth, emailVerified, renderEdit);
router.post('/budgets/:id', sessionAuth, emailVerified, validate(budgetSchema), updateBudget);
router.post('/budgets/:id/delete', sessionAuth, emailVerified, deleteBudget);

export default router; 