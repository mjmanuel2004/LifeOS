import express from 'express';
import { register, login, getMe, forgotPassword, resetPassword, generate2FA, enable2FA, loginVerify2FA, googleLogin, githubLogin, appleLogin } from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/login/verify', loginVerify2FA);
router.post('/google', googleLogin);
router.post('/github', githubLogin);
router.post('/apple', appleLogin);
router.get('/me', protect, getMe);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resettoken', resetPassword);

router.post('/2fa/generate', protect, generate2FA);
router.post('/2fa/enable', protect, enable2FA);

export default router;
