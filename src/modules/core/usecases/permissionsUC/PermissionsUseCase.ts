import { Permissions } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

import { prisma } from '../../../../database/prismaClient';
import { HandleErrors } from '../../../../shared/errors/HandleErrors';
import { ICreatePermissionDTO, IPermissionsRepository, IUpdatePermissionDTO, IIndexRequest } from '../../../interfaces/IPermissionRepository';

export class PermissionsUseCase implements IPermissionsRepository {
	async create(data: ICreatePermissionDTO): Promise<Permissions> {
		const { key, display_name, description } = data;

		const permissionAlredyExists = await prisma.permissions.findFirst({
			where: {
				key: {
					equals: key,
					mode: 'insensitive',
				},
			},
		});

		if (permissionAlredyExists) {
			throw new HandleErrors('Permissão já cadastrada');
		}

		const newPermission = await prisma.permissions.create({
			data: {
				key,
				display_name,
				description,
			},
		});

		return newPermission;
	}

	async update(data: IUpdatePermissionDTO): Promise<Permissions> {
		const { id, key, display_name, description } = data;

		const updatePermission = await prisma.permissions
			.update({
				where: {
					id,
				},
				data: {
					key,
					display_name,
					description,
					updated_at: new Date(),
				},
			})
			.catch((error: PrismaClientKnownRequestError) => {
				throw new HandleErrors(error.message, 404);
			});

		return updatePermission;
	}

	async delete(id: number): Promise<void> {
		await prisma.permissions.delete({
			where: {
				id,
			},
		});
	}

	async getAll({ key, display_name }: IIndexRequest): Promise<Permissions[]> {
		console.log(key, display_name);

		const permissions = await prisma.permissions.findMany({
			where: {
				key: {
					contains: key,
					mode: 'insensitive',
				},
				display_name: {
					contains: display_name,
					mode: 'insensitive',
				},
			},
		});

		return permissions;
	}

	async findById(id: number): Promise<Permissions> {
		const permission = await prisma.permissions
			.findFirstOrThrow({
				where: {
					id,
				},
			})
			.catch((error: PrismaClientKnownRequestError) => {
				throw new HandleErrors(error.message, 404);
			});

		return permission;
	}
}
