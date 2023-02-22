import { Router } from 'express';

import { ensureAuthenticate } from '../middleware/ensureAuthenticate';
import { UserController } from '../modules/core/controllers/usersC/UserController';
import { UsersSecondFactorKeyController } from '../modules/core/controllers/usersC/UsersSecondFactorKeyController';

const usersRoutes = Router();

const userController = new UserController();
const usersSecondFactorKeyController = new UsersSecondFactorKeyController();

usersRoutes.get('/', ensureAuthenticate, userController.handleIndex);
usersRoutes.get('/:id', ensureAuthenticate, userController.handleIndexByUserId);
usersRoutes.post('/', userController.handleCreate);
usersRoutes.put('/', ensureAuthenticate, userController.handleUpdate);
usersRoutes.delete('/:id', ensureAuthenticate, userController.handleIndex);
usersRoutes.post('/generate2fa', usersSecondFactorKeyController.handleGenerate);
usersRoutes.post('/validate2fa', usersSecondFactorKeyController.handleValidate2faKey);

export { usersRoutes };
