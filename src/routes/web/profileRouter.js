import express from 'express';
import { sessionAuth } from '../../middleware/sessionAuth.js';
import { emailVerified } from '../../middleware/emailVerified.js';
import { validate } from '../../middleware/validatorMiddleware.js';
import { updateNameSchema } from '../../validations/validatorSchema.js';
import { profile, updateName } from '../../controllers/profileController.js';

const router = express.Router();

router.get('/profile', sessionAuth, emailVerified, profile);
router.post('/profile', sessionAuth, emailVerified, validate(updateNameSchema), updateName);

export default router;
