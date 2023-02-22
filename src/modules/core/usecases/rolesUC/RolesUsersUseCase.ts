import { RolesUsers } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

import { prisma } from '../../../../database/prismaClient';
import { HandleErrors } from '../../../../shared/errors/HandleErrors';
import { IRolesUsersImplementations, ICreateRolesUserDTO, IUpdateRolesUserDTO, IUpdateRolesUserResponse, IDeleteRolesUserDTO, IIndexRequest } from '../../../interfaces/IRolesUsers';

export class RolesUsersUseCase implements IRolesUsersImplementations {
	async create(data: ICreateRolesUserDTO): Promise<number> {
		const { roles } = data;

		const rolesIds = roles.map((role) => role.id_role);
		const userIds = roles.map((user) => user.id_user);

		const userRoleAlredyExists = await prisma.rolesUsers.findMany({
			where: {
				OR: [
					{
						id_user: {
							in: userIds,
						},
					},
				],
				AND: {
					id_role: {
						in: rolesIds,
					},
				},
			},
		});

		if (userRoleAlredyExists.length > 0) {
			throw new HandleErrors('Usuário já possui uma das funções cadastradas', 401);
		}

		const insertRoles = await prisma.rolesUsers.createMany({
			data: roles,
		});

		const { count } = insertRoles;
		return count;
	}

	async update(data: IUpdateRolesUserDTO): Promise<IUpdateRolesUserResponse> {
		const { roles, id_user } = data;

		const userRoles = await prisma.rolesUsers.findMany({
			where: {
				id_user,
			},
		});

		const rolesToDelete = userRoles
			.filter((userRole) => {
				return !roles.some((role) => role.id_role === userRole.id_role);
			})
			.map((rolesId) => rolesId.id_role);

		const rolesToAdd = roles.filter((role) => {
			return !userRoles.some((userRole) => role.id_role === userRole.id_role);
		});

		const queryDeleteUserRoles = await prisma.rolesUsers.deleteMany({
			where: {
				id_role: {
					in: rolesToDelete,
				},
			},
		});

		const queryInsertUserRoles = await prisma.rolesUsers.createMany({
			data: rolesToAdd,
		});

		return { countDeletedRoles: queryDeleteUserRoles.count, countInsertRoles: queryInsertUserRoles.count };
	}

	async delete(data: IDeleteRolesUserDTO): Promise<number> {
		const { id_user, multipleRolesId } = data;

		const deleteUserRoles = await prisma.rolesUsers.deleteMany({
			where: {
				id_role: {
					in: multipleRolesId,
				},
				AND: {
					id_user,
				},
			},
		});

		const { count } = deleteUserRoles;
		return count;
	}

	async getAll({ id_role, id_user }: IIndexRequest): Promise<Partial<RolesUsers>[]> {
		const usersRoles = await prisma.rolesUsers.findMany({
			select: {
				id: true,
				id_role: true,
				id_user: true,
				roles: {
					select: {
						key: true,
						display_name: true,
						description: true,
					},
				},
				user: {
					select: {
						name: true,
					},
				},
			},
			where: {
				id_role,
				id_user,
			},
			orderBy: {
				id_role: 'asc',
			},
		});

		return usersRoles;
	}

	async findById(id: number): Promise<RolesUsers> {
		const role = await prisma.rolesUsers
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
