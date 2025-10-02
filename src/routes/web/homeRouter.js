import express from 'express';
import { sessionAuth } from '../../middleware/sessionAuth.js';
import { emailVerified } from '../../middleware/emailVerified.js';
import { home, about } from '../../controllers/homeController.js';
import { profile } from '../../controllers/profileController.js';
import transactionRouter from './transactionRouter.js';
import budgetRouter from './budgetRouter.js';
import goalRouter from './goalRouter.js';
import dashboardRouter from './dashboardRouter.js';
import categoryRouter from './categoryRouter.js';


const router = express.Router();

router.use('/', dashboardRouter);
router.get('/about', about);
router.get('/profile', sessionAuth, emailVerified, profile);

router.use('/', transactionRouter);
router.use('/', budgetRouter);
router.use('/', goalRouter);
router.use('/', categoryRouter);

export default router; 