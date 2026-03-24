import express from 'express';
import * as userController from '../controllers/userController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.get('/me', authenticate, userController.getMe);
router.put('/me', authenticate, userController.updateProfile);
router.get('/', authenticate, userController.listUsers);

export default router;
