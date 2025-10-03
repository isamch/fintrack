import express from 'express';

// Import all route modules
import authRouter from './authRoute.js';
import homeRouter from './homeRouter.js';
import categoryRouter from './categoryRouter.js';
import transactionRouter from './transactionRouter.js';
import budgetRouter from './budgetRouter.js';
import goalRouter from './goalRouter.js';
import dashboardRouter from './dashboardRouter.js';

const router = express.Router();

// Register all routes
router.use('/', authRouter);
router.use('/', homeRouter);
router.use('/', categoryRouter);
router.use('/', transactionRouter);
router.use('/', budgetRouter);
router.use('/', goalRouter);
router.use('/', dashboardRouter);

export default router;
