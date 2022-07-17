import express from 'express';
import { authUser, getUserProfile } from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/login', authUser);

router.route('/profile').get(protect, getUserProfile);

export default router;
