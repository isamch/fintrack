import express from 'express';
import { sessionAuth } from '../../middleware/sessionAuth.js';
import { emailVerified } from '../../middleware/emailVerified.js';
import { home, about } from '../../controllers/homeController.js';
import { profile } from '../../controllers/profileController.js';
import transactionRouter from './transactionRouter.js';
import budgetRouter from './budgetRouter.js';


const router = express.Router();

router.get('/', sessionAuth, emailVerified, home);
router.get('/about', about);
router.get('/profile', sessionAuth, emailVerified, profile);

router.use('/', transactionRouter);
router.use('/', budgetRouter);

export default router; 