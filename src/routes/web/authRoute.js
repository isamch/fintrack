import express from 'express';
import { sessionAuth } from '../../middleware/sessionAuth.js';
import { guestOnly } from '../../middleware/guestOnly.js';
import { validate } from '../../middleware/validatorMiddleware.js';
import { registerSchema, loginSchema, emailSchema, resetPasswordWithOtpSchema } from '../../validations/validatorSchema.js';
import { renderRegister, renderLogin, renderVerify, postRegister, postLogin, postLogout, postSendVerificationCode, postVerifyEmail, renderForgotPassword, renderResetPassword, postForgotPassword, postResetPassword } from '../../controllers/authController.js';
import { redirectIfVerified } from '../../middleware/emailVerified.js';


const router = express.Router();


// guest-only pages
router.get('/register', guestOnly, renderRegister);
router.get('/login', guestOnly, renderLogin);

// password reset (web)
router.get('/forgot-password', guestOnly, renderForgotPassword);
router.post('/forgot-password', guestOnly, validate(emailSchema), postForgotPassword);
router.get('/reset-password', guestOnly, renderResetPassword);
router.post('/reset-password', guestOnly, validate(resetPasswordWithOtpSchema), postResetPassword);

// actions
router.post('/register', guestOnly, validate(registerSchema), postRegister);
router.post('/login', guestOnly, validate(loginSchema), postLogin);
router.post('/logout', sessionAuth, postLogout);

// email verification (requires auth)
router.get('/verify', sessionAuth, redirectIfVerified, renderVerify);
router.post('/verify/send', sessionAuth, redirectIfVerified, postSendVerificationCode);
router.post('/verify', sessionAuth, redirectIfVerified, postVerifyEmail);


export default router; 