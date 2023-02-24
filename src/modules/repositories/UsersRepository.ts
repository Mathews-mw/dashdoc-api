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

	async update(user_id: string, data: IUpdateUserDTO): Promise<Users> {
		const { name, email, phone_number, cpf, bio, company } = data;

		const updateUser = await prisma.users
			.update({
				where: {
					id: user_id,
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

	async delete(user_id: string): Promise<void> {
		await prisma.users.delete({
			where: {
				id: user_id,
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

	async findById(user_id: string): Promise<Users> {
		const user = await prisma.users.findUniqueOrThrow({
			include: {
				permissionsUsers: {
					select: {
						permission: {
							select: {
								key: true,
							},
						},
					},
				},
				rolesUsers: {
					select: {
						roles: {
							select: {
								key: true,
							},
						},
					},
				},
			},
			where: {
				id: user_id,
			},
		});

		return user;
	}

	async findByEmail(email: string): Promise<Users> {
		const user = await prisma.users.findUniqueOrThrow({
			where: {
				email,
			},
		});

		return user;
	}

	async findByCpf(cpf: string): Promise<Users> {
		const user = await prisma.users.findUniqueOrThrow({
			where: {
				cpf,
			},
		});

		return user;
	}
}
