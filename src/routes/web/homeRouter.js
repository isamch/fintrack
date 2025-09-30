import express from 'express';
import { sessionAuth } from '../../middleware/sessionAuth.js';
import { emailVerified } from '../../middleware/emailVerified.js';
import { home, about } from '../../controllers/homeController.js';


const router = express.Router();

router.get('/', sessionAuth, emailVerified, home);
router.get('/about', about);

export default router; 