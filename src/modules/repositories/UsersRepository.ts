import { Users } from '@prisma/client';

import { prisma } from '../../database/prismaClient';

import { ICreateUserDTO, IUpdateUserDTO, IUserRepository } from './interfaces/IUserRepository';

export class UsersRepository implements IUserRepository {
	async create(data: ICreateUserDTO): Promise<Users> {
		const { name, email, password, confirm_password } = data;

		const newUser = await prisma.users.create({
			data: {
				name,
				email,
				password,
				confirm_password,
			},
		});

		return newUser;
	}

	async update(data: IUpdateUserDTO): Promise<Users> {
		const { id, name, email, phone_number, cpf, bio, company } = data;

		const updateUser = await prisma.users
			.update({
				where: {
					id,
				},
				data: {
					name,
					email,
					phone_number,
					cpf,
					bio,
					company,
					updated_at: new Date(),
				},
			})
			.catch((error) => {
				return error;
			});

		return updateUser;
	}

	async delete(id: string): Promise<void> {
		await prisma.users.delete({
			where: {
				id,
			},
		});
	}

	async gettAllUsers(): Promise<Partial<Users>[]> {
		const users = await prisma.users.findMany({
			select: {
				id: true,
				name: true,
				email: true,
				phone_number: true,
				cpf: true,
				company: true,
				created_at: true,
				updated_at: true,
			},
		});

		return users;
	}

	async findById(id: string): Promise<Partial<Users>> {
		const user = await prisma.users.findUniqueOrThrow({
			select: {
				id: true,
				name: true,
				email: true,
				phone_number: true,
				cpf: true,
				company: true,
				bio: true,
				created_at: true,
				updated_at: true,
				rolesUsers: {
					select: {
						roles: {
							select: {
								key: true,
							},
						},
					},
				},
				permissionsUsers: {
					select: {
						permission: true,
					},
				},
			},
			where: {
				id,
			},
		});

		return user;
	}

	async findByCpf(cpf: string): Promise<Partial<Users>> {
		const user = await prisma.users.findUniqueOrThrow({
			select: {
				id: true,
				name: true,
				email: true,
				phone_number: true,
				cpf: true,
				company: true,
				created_at: true,
				updated_at: true,
			},
			where: {
				cpf,
			},
		});

		return user;
	}
}
