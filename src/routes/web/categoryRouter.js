import express from 'express';
import { sessionAuth } from '../../middleware/sessionAuth.js';
import { emailVerified } from '../../middleware/emailVerified.js';
import { validate } from '../../middleware/validatorMiddleware.js';
import { categorySchema } from '../../validations/validatorSchema.js';
import { listCategories, renderCreate, createCategory, renderEdit, updateCategory, deleteCategory } from '../../controllers/categoryController.js';

const router = express.Router();

router.get('/categories', sessionAuth, emailVerified, listCategories);
router.get('/categories/new', sessionAuth, emailVerified, renderCreate);
router.post('/categories', sessionAuth, emailVerified, validate(categorySchema), createCategory);
router.get('/categories/:id/edit', sessionAuth, emailVerified, renderEdit);
router.post('/categories/:id', sessionAuth, emailVerified, validate(categorySchema), updateCategory);
router.post('/categories/:id/delete', sessionAuth, emailVerified, deleteCategory);

export default router; 