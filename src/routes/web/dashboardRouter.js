import express from 'express';
import { sessionAuth } from '../../middleware/sessionAuth.js';
import { emailVerified } from '../../middleware/emailVerified.js';
import { dashboard } from '../../controllers/dashboardController.js';

const router = express.Router();

router.get('/', sessionAuth, emailVerified, dashboard);
router.get('/dashboard', sessionAuth, emailVerified, dashboard);

export default router; 