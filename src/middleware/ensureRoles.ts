import { NextFunction, Request, Response } from 'express';

import { prisma } from '../database/prismaClient';

export async function ensureRoles(request: Request, response: Response, next: NextFunction) {
	const { id } = request.user;

	// const originalUrl = request.originalUrl;
	const requestMethod = request.method;

	try {
		const userHasRoles = await prisma.rolesUsers.findMany({
			where: {
				id_user: id,
			},
			select: {
				roles: {
					select: {
						key: true,
					},
				},
			},
		});

		if (!userHasRoles) {
			return response.status(401).json({ error: 'Not allowed to acess this route' });
		}

		const userOnlyRolesKeys = userHasRoles.map((userRoles) => {
			return userRoles.roles.key;
		});

		let hasAccess = false;

		switch (requestMethod) {
			case 'GET': {
				const allowedRoles = ['all', 'list'];
				if (allowedRoles.some((role) => userOnlyRolesKeys.includes(role))) {
					hasAccess = true;
				}
				break;
			}

			case 'POST': {
				const allowedRoles = ['all', 'create'];
				if (allowedRoles.some((role) => userOnlyRolesKeys.includes(role))) {
					hasAccess = true;
				}
				break;
			}

			case 'UPDATE':
			case 'PATCH': {
				const allowedRoles = ['all', 'modify'];
				if (allowedRoles.some((role) => userOnlyRolesKeys.includes(role))) {
					hasAccess = true;
				}
				break;
			}

			case 'DELETE': {
				const allowedRoles = ['all', 'delete'];
				if (allowedRoles.some((role) => userOnlyRolesKeys.includes(role))) {
					hasAccess = true;
				}
				break;
			}

			default:
				hasAccess = false;
				break;
		}

		if (hasAccess) {
			return next();
		} else {
			return response.status(403).json({ error: 'Not allowed to access this route' });
		}
	} catch (error) {
		return response.status(404).json({ error: 'User not found' });
	}
}
