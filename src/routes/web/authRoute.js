import express from 'express';
import { sessionAuth } from '../../middleware/sessionAuth.js';
import { renderRegister, renderLogin, renderVerify, postRegister, postLogin, postLogout, postSendVerificationCode, postVerifyEmail } from '../../controllers/authController.js';


const router = express.Router();



// public pages
router.get('/register', renderRegister);
router.get('/login', renderLogin);

// actions
router.post('/register', postRegister);
router.post('/login', postLogin);
router.post('/logout', sessionAuth, postLogout);

// email verification (requires auth)
router.get('/verify', sessionAuth, renderVerify);
router.post('/verify/send', sessionAuth, postSendVerificationCode);
router.post('/verify', sessionAuth, postVerifyEmail);


export default router; 