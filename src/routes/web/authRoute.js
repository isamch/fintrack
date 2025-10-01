import express from 'express';
import { sessionAuth } from '../../middleware/sessionAuth.js';
import { guestOnly } from '../../middleware/guestOnly.js';
import { renderRegister, renderLogin, renderVerify, postRegister, postLogin, postLogout, postSendVerificationCode, postVerifyEmail } from '../../controllers/authController.js';
import { redirectIfVerified } from '../../middleware/emailVerified.js';


const router = express.Router();


// guest-only pages
router.get('/register', guestOnly, renderRegister);
router.get('/login', guestOnly, renderLogin);

// actions
router.post('/register', guestOnly, postRegister);
router.post('/login', guestOnly, postLogin);
router.post('/logout', sessionAuth, postLogout);

// email verification (requires auth)
router.get('/verify', sessionAuth, redirectIfVerified, renderVerify);
router.post('/verify/send', sessionAuth, redirectIfVerified, postSendVerificationCode);
router.post('/verify', sessionAuth, redirectIfVerified, postVerifyEmail);


export default router; 