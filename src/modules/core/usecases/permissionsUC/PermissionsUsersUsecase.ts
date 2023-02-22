import { PermissionsUsers } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

import { prisma } from '../../../../database/prismaClient';
import { HandleErrors } from '../../../../shared/errors/HandleErrors';
import { ICreatePermissionUserDTO, IIndexRequest, IPermissionsUsers, IUpdatePermissionUserDTO } from '../../../interfaces/IPermissionsUsers';

export class PermissionsUsersUsecase implements IPermissionsUsers {
	async create(data: ICreatePermissionUserDTO): Promise<PermissionsUsers> {
		const { id_user, id_permission } = data;

		const userPermission = await prisma.permissionsUsers.findUnique({
			where: {
				id_user,
			},
		});
		if (userPermission) {
			throw new HandleErrors('Usuário já possui permissão cadastrada no sistema', 401);
		}

		const insertUserPermission = await prisma.permissionsUsers.create({
			data: {
				id_user,
				id_permission,
			},
		});

		return insertUserPermission;
	}

	async update(data: IUpdatePermissionUserDTO): Promise<PermissionsUsers> {
		const { id_user, id_permission } = data;

		const updateUserPermission = await prisma.permissionsUsers
			.update({
				where: {
					id_user,
				},
				data: {
					id_permission,
				},
			})
			.catch((error: PrismaClientKnownRequestError) => {
				throw new HandleErrors(error.message, 404);
			});

		return updateUserPermission;
	}

	async delete(id_user: string): Promise<void> {
		await prisma.permissionsUsers
			.delete({
				where: {
					id_user,
				},
			})
			.catch((error: PrismaClientKnownRequestError) => {
				throw new HandleErrors(error.message, 404);
			});
	}

	async getAll(data: IIndexRequest): Promise<PermissionsUsers[]> {
		const { key, display_name } = data;

		const uerersPermissions = await prisma.permissionsUsers.findMany({
			select: {
				id: true,
				id_user: true,
				id_permission: true,
				created_at: true,
				updated_at: true,
				permission: {
					select: {
						key: true,
						display_name: true,
					},
				},
				user: {
					select: {
						name: true,
					},
				},
			},
			where: {
				permission: {
					key,
					display_name,
				},
			},
		});

		return uerersPermissions;
	}

	async findByUserId(userId: string): Promise<PermissionsUsers> {
		const userPermission = await prisma.permissionsUsers
			.findUniqueOrThrow({
				select: {
					id: true,
					id_user: true,
					id_permission: true,
					created_at: true,
					updated_at: true,
					permission: {
						select: {
							key: true,
							display_name: true,
						},
					},
					user: {
						select: {
							name: true,
						},
					},
				},
				where: {
					id_user: userId,
				},
			})
			.catch((error: PrismaClientKnownRequestError) => {
				throw new HandleErrors(error.message, 404);
			});

		return userPermission;
	}
}
