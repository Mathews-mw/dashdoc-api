import { Router } from 'express';

import { authRoutes } from './auth.routes';
import { usersRoutes } from './users.routes';
import { permissionsRoutes } from './permissions.routes';
import { rolesRoutes } from './roles.routes';

const routes = Router();

routes.use('/authenticate', authRoutes);

routes.use('/users', usersRoutes);
routes.use('/permissions', permissionsRoutes);
routes.use('/roles', rolesRoutes);

export { routes };
