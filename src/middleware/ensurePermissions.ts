import { NextFunction, Request, Response } from 'express';

import { prisma } from '../database/prismaClient';

export async function ensurePermissions(request: Request, response: Response, next: NextFunction) {
	const { id } = request.user;

	try {
		const userHasPermission = await prisma.permissionsUsers.findUniqueOrThrow({
			where: {
				id_user: id,
			},
		});

		if (!userHasPermission) {
			return response.status(401).json({ error: 'Not allowed to acess this route' });
		}

		return next();
	} catch (error) {
		return response.status(404).json({ error: 'User not found' });
	}
}
