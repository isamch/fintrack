import express from 'express';

// Import all route modules
import authRouter from './authRoute.js';
import categoryRouter from './categoryRouter.js';
import transactionRouter from './transactionRouter.js';
import budgetRouter from './budgetRouter.js';
import goalRouter from './goalRouter.js';
import dashboardRouter from './dashboardRouter.js';
import profileRouter from './profileRouter.js';

const router = express.Router();

// Register all routes
router.use('/', authRouter);
router.use('/', profileRouter);
router.use('/', categoryRouter);
router.use('/', transactionRouter);
router.use('/', budgetRouter);
router.use('/', goalRouter);
router.use('/', dashboardRouter);

export default router;
