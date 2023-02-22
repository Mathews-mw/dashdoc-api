import { Router } from 'express';

import { ensureRoles } from '../middleware/ensureRoles';
import { ensurePermissions } from '../middleware/ensurePermissions';
import { ensureAuthenticate } from '../middleware/ensureAuthenticate';
import { PermissionsController } from '../modules/core/controllers/permissionsC/PermissionsController';
import { PermissionsUsersController } from '../modules/core/controllers/permissionsC/PermissionsUsersController';

const permissionsRoutes = Router();

const permissionsController = new PermissionsController();
const permissionsUsersController = new PermissionsUsersController();

permissionsRoutes.get('/users', [ensureAuthenticate, ensurePermissions, ensureRoles], permissionsUsersController.handleGetAll);
permissionsRoutes.get('/users/:userId', ensureAuthenticate, permissionsUsersController.handleFindByUserId);
permissionsRoutes.post('/users', [ensureAuthenticate, ensurePermissions, ensureRoles], permissionsUsersController.handleCreate);
permissionsRoutes.put('/users/:userId', [ensureAuthenticate, ensurePermissions, ensureRoles], permissionsUsersController.handleUpdate);
permissionsRoutes.delete('/users/:userId', [ensureAuthenticate, ensurePermissions, ensureRoles], permissionsUsersController.handleDelete);

permissionsRoutes.get('/', [ensureAuthenticate, ensurePermissions, ensureRoles], permissionsController.handleIndex);
permissionsRoutes.get('/:id', ensureAuthenticate, permissionsController.handleIndexById);
permissionsRoutes.post('/', [ensureAuthenticate, ensurePermissions, ensureRoles], permissionsController.handleCreate);
permissionsRoutes.put('/:id', [ensureAuthenticate, ensurePermissions, ensureRoles], permissionsController.handleUpdate);
permissionsRoutes.delete('/:id', [ensureAuthenticate, ensurePermissions, ensureRoles], permissionsController.handleDelete);

export { permissionsRoutes };
