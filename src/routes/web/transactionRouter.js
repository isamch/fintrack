import express from 'express';
import { sessionAuth } from '../../middleware/sessionAuth.js';
import { emailVerified } from '../../middleware/emailVerified.js';
import { listTransactions, renderCreate, createTransaction, renderEdit, updateTransaction, deleteTransaction } from '../../controllers/transactionController.js';

const router = express.Router();

router.get('/transactions', sessionAuth, emailVerified, listTransactions);
router.get('/transactions/new', sessionAuth, emailVerified, renderCreate);
router.post('/transactions', sessionAuth, emailVerified, createTransaction);
router.get('/transactions/:id/edit', sessionAuth, emailVerified, renderEdit);
router.post('/transactions/:id', sessionAuth, emailVerified, updateTransaction);
router.post('/transactions/:id/delete', sessionAuth, emailVerified, deleteTransaction);

export default router; 