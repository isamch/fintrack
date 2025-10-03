import express from 'express';
import { sessionAuth } from '../../middleware/sessionAuth.js';
import { emailVerified } from '../../middleware/emailVerified.js';
import { validate } from '../../middleware/validatorMiddleware.js';
import { savingGoalSchema } from '../../validations/validatorSchema.js';
import { listGoals, renderCreate, createGoal, renderEdit, updateGoal, deleteGoal } from '../../controllers/savingGoalController.js';

const router = express.Router();

router.get('/goals', sessionAuth, emailVerified, listGoals);
router.get('/goals/new', sessionAuth, emailVerified, renderCreate);
router.post('/goals', sessionAuth, emailVerified, validate(savingGoalSchema), createGoal);
router.get('/goals/:id/edit', sessionAuth, emailVerified, renderEdit);
router.post('/goals/:id', sessionAuth, emailVerified, validate(savingGoalSchema), updateGoal);
router.post('/goals/:id/delete', sessionAuth, emailVerified, deleteGoal);

export default router; 