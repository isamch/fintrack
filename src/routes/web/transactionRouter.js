import express from 'express';
import { sessionAuth } from '../../middleware/sessionAuth.js';
import { emailVerified } from '../../middleware/emailVerified.js';
import { validate } from '../../middleware/validatorMiddleware.js';
import { transactionSchema } from '../../validations/validatorSchema.js';
import { listTransactions, renderCreate, createTransaction, renderEdit, updateTransaction, deleteTransaction } from '../../controllers/transactionController.js';

const router = express.Router();

router.get('/transactions', sessionAuth, emailVerified, listTransactions);
router.get('/transactions/new', sessionAuth, emailVerified, renderCreate);
router.post('/transactions', sessionAuth, emailVerified, validate(transactionSchema), createTransaction);
router.get('/transactions/:id/edit', sessionAuth, emailVerified, renderEdit);
router.post('/transactions/:id', sessionAuth, emailVerified, validate(transactionSchema), updateTransaction);
router.post('/transactions/:id/delete', sessionAuth, emailVerified, deleteTransaction);

export default router; 