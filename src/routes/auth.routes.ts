import { Router } from 'express';

import { AuthController } from '../modules/core/controllers/authenticateC/AuthController';
import { RefreshTokenController } from '../modules/core/controllers/authenticateC/RefreshTokenController';
import { ValidateTowFactorKeyController } from '../modules/core/controllers/authenticateC/ValidateTowFactorKeyController';

const authRoutes = Router();

const authController = new AuthController();
const refreshTokenController = new RefreshTokenController();
const validateTowFactorKeyController = new ValidateTowFactorKeyController();

authRoutes.post('/', authController.handle);
authRoutes.post('/2factor', validateTowFactorKeyController.handle);
authRoutes.post('/refresh-token', refreshTokenController.handle);

export { authRoutes };
