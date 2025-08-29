import { Router } from 'express';
import { container } from 'tsyringe';
import { ModeConfigurationsController } from '../mode-configurations/mode-configurations.controller.js';

const router = Router();
const controller = container.resolve(ModeConfigurationsController);

router.post('/validation', controller.validation);

export default router;
