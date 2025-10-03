import Joi from "joi";

/**
 * ✅ Register (signup) validation
 */
export const registerSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  // name: Joi.string()
  //   .min(3)
  //   .max(30)
  //   .required()
  //   .messages({
  //     "string.base": "Name must be a string",
  //     "string.empty": "Name cannot be empty",
  //     "string.min": "Name should have at least 3 characters",
  //     "string.max": "Name should have at most 30 characters",
  //     "any.required": "Name is required"
  //   }),
    
  // username: Joi.string().alphanum().min(3).max(20).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  // confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
  // age: Joi.number().integer().min(18).max(100),
  // phone: Joi.string().pattern(/^[0-9]{10,15}$/),
  // gender: Joi.string().valid('male', 'female', 'other'),
  // terms: Joi.boolean().valid(true).required(),
});

/**
 * ✅ Login validation
 */
export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

/**
 * ✅ Email validation (Forgot password)
 */
export const emailSchema = Joi.object({
  email: Joi.string().email().required(),
});

/**
 * ✅ Password reset/change validation
 */
export const passwordSchema = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required(),
  confirmNewPassword: Joi.string().valid(Joi.ref('newPassword')).required(),
});

/**
 * ✅ Forgot password (OTP) validation
 */
export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

/**
 * ✅ Reset password with OTP validation
 */
export const resetPasswordWithOtpSchema = Joi.object({
  email: Joi.string().email().required(),
  code: Joi.string().length(6).required(),
  newPassword: Joi.string().min(6).required(),
  confirmNewPassword: Joi.string().valid(Joi.ref('newPassword')).required(),
});

/**
 * ✅ Profile update validation
 */
export const updateProfileSchema = Joi.object({
  name: Joi.string().min(3).max(30),
  username: Joi.string().alphanum().min(3).max(20),
  email: Joi.string().email(),
  password: Joi.string().min(6),
  age: Joi.number().integer().min(18).max(100),
  phone: Joi.string().pattern(/^[0-9]{10,15}$/),
  gender: Joi.string().valid('male', 'female', 'other'),
});

/**
 * ✅ Category validation
 */
export const categorySchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  type: Joi.string().valid('income', 'expense').required(),
});

/**
 * ✅ Transaction validation
 */
export const transactionSchema = Joi.object({
  type: Joi.string().valid('income', 'expense').required(),
  amount: Joi.number().positive().precision(2).required(),
  currency: Joi.string().length(3).default('MAD'),
  description: Joi.string().max(255).allow(null, ''),
  occurredAt: Joi.date().required(),
  categoryId: Joi.number().integer().positive().allow(null),
});

/**
 * ✅ Budget validation
 */
export const budgetSchema = Joi.object({
  categoryId: Joi.number().integer().positive().allow(null),
  period: Joi.string().valid('monthly', 'weekly', 'yearly').default('monthly'),
  month: Joi.number().integer().min(1).max(12).allow(null),
  year: Joi.number().integer().min(2000).max(2100).allow(null),
  amount: Joi.number().positive().precision(2).required(),
  currency: Joi.string().length(3).default('MAD'),
});

/**
 * ✅ Saving Goal validation
 */
export const savingGoalSchema = Joi.object({
  name: Joi.string().min(1).max(150).required(),
  targetAmount: Joi.number().positive().precision(2).required(),
  currentAmount: Joi.number().min(0).precision(2).default(0),
  currency: Joi.string().length(3).default('MAD'),
  dueDate: Joi.date().allow(null),
  description: Joi.string().max(255).allow(null, ''),
});