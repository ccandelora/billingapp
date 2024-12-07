import express from 'express';
import { SettingsController } from '../controllers/SettingsController';

const router = express.Router();

// Debug middleware for settings routes
router.use((req, res, next) => {
    console.log('Settings route:', req.method, req.url);
    next();
});

router.get('/', SettingsController.getSettings);
router.put('/', SettingsController.updateSettings);

export default router; 