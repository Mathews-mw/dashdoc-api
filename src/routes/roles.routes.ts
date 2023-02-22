import { Router } from 'express';

import { ensureAuthenticate } from '../middleware/ensureAuthenticate';
import { ensureRoles } from '../middleware/ensureRoles';
import { RolesController } from '../modules/core/controllers/rolesC/RolesController';
import { RolesUsersController } from '../modules/core/controllers/rolesC/RolesUsersController';

const rolesRoutes = Router();

const rolesController = new RolesController();
const rolesUsersController = new RolesUsersController();

rolesRoutes.get('/users', [ensureAuthenticate, ensureRoles], rolesUsersController.handleIndex);
rolesRoutes.post('/users', [ensureAuthenticate, ensureRoles], rolesUsersController.handleCreate);
rolesRoutes.put('/users/:userId', ensureAuthenticate, rolesUsersController.handleUpdate);
rolesRoutes.delete('/users/:userId', [ensureAuthenticate, ensureRoles], rolesUsersController.handleDelete);

rolesRoutes.get('/', [ensureAuthenticate, ensureRoles], rolesController.handleIndex);
rolesRoutes.get('/:id', ensureAuthenticate, rolesController.handleIndexById);
rolesRoutes.post('/', [ensureAuthenticate, ensureRoles], rolesController.handleCreate);
rolesRoutes.put('/:id', [ensureAuthenticate, ensureRoles], rolesController.handleUpdate);
rolesRoutes.delete('/:id', [ensureAuthenticate, ensureRoles], rolesController.handleDelete);

export { rolesRoutes };
