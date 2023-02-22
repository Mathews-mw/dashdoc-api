import { Roles } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

import { prisma } from '../../../../database/prismaClient';
import { HandleErrors } from '../../../../shared/errors/HandleErrors';
import { IRolesRepository, ICreateRoleDTO, IUpdateRoleDTO, IIndexRequest } from '../../../interfaces/IRolesRepository';

export class RolesUseCase implements IRolesRepository {
	async create(data: ICreateRoleDTO): Promise<Roles> {
		const { key, display_name, description } = data;

		const roleAlredyExists = await prisma.roles.findFirst({
			where: {
				key: {
					equals: key,
					mode: 'insensitive',
				},
			},
		});

		if (roleAlredyExists) {
			throw new HandleErrors('Função já cadastrada');
		}

		const newRole = await prisma.roles.create({
			data: {
				key,
				display_name,
				description,
			},
		});

		return newRole;
	}

	async update(data: IUpdateRoleDTO): Promise<Roles> {
		const { id, key, display_name, description } = data;

		const updateRole = await prisma.roles
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

		return updateRole;
	}

	async delete(id: number): Promise<void> {
		await prisma.roles.delete({
			where: {
				id,
			},
		});
	}

	async getAll({ key, display_name }: IIndexRequest): Promise<Roles[]> {
		console.log(key, display_name);

		const roles = await prisma.roles.findMany({
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

		return roles;
	}

	async findById(id: number): Promise<Roles> {
		const role = await prisma.roles
			.findFirstOrThrow({
				where: {
					id,
				},
			})
			.catch((error: PrismaClientKnownRequestError) => {
				throw new HandleErrors(error.message, 404);
			});

		return role;
	}
}
