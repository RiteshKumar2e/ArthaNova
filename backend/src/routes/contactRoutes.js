import express from 'express';
import { handleContactSubmission } from '../controllers/contactController.js';

const router = express.Router();

router.post('/submit', handleContactSubmission);

export default router;
