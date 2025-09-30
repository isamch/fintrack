import express from 'express';

// controllers :
import { home, about } from '../../controllers/homeController.js';
import authWebRouter from './auth.js';

const router = express.Router();

router.get('/', home);
router.get('/about', about);

router.use('/auth', authWebRouter);

export default router; 