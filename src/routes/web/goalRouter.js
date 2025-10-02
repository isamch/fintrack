import express from 'express';
import { sessionAuth } from '../../middleware/sessionAuth.js';
import { emailVerified } from '../../middleware/emailVerified.js';
import { listGoals, renderCreate, createGoal, renderEdit, updateGoal, deleteGoal } from '../../controllers/savingGoalController.js';

const router = express.Router();

router.get('/goals', sessionAuth, emailVerified, listGoals);
router.get('/goals/new', sessionAuth, emailVerified, renderCreate);
router.post('/goals', sessionAuth, emailVerified, createGoal);
router.get('/goals/:id/edit', sessionAuth, emailVerified, renderEdit);
router.post('/goals/:id', sessionAuth, emailVerified, updateGoal);
router.post('/goals/:id/delete', sessionAuth, emailVerified, deleteGoal);

export default router; 