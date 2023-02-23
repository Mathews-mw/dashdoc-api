import { inject, injectable } from 'tsyringe';
import { Users } from '@prisma/client';
import { hash } from 'bcryptjs';

import { prisma } from '../../../../database/prismaClient';
import { HandleErrors } from '../../../../shared/errors/HandleErrors';
import { UsersRepository } from '../../../repositories/UsersRepository';
import { IUserRepository } from '../../../repositories/interfaces/IUserRepository';
import { IUpdateUserDTO, IFindUniqueUser } from '../../../interfaces/IUserRepository';

import { UsersUseCaseErrors } from './UsersUseCaseErrors';

interface ICreateUserRequest {
	name: string;
	email: string;
	password: string;
	confirm_password: string;
}

@injectable()
export class UsersUseCase implements IUserRepository {
	constructor(
		@inject(UsersRepository)
		private usersRepository: IUserRepository // eslint-disable-next-line no-empty-function
	) {}

	findByEmail(email: string): Promise<Partial<Users>> {
		throw new Error('Method not implemented.');
	}

	async create(data: ICreateUserRequest): Promise<Users> {
		const { name, email, password, confirm_password } = data;

		const userAlredyExists = await this.usersRepository.findByEmail(email);

		console.log('userAlredyExists use case: ', userAlredyExists);

		if (userAlredyExists) {
			throw new UsersUseCaseErrors.EmailAreadyInUse();
		}

		const hashPassword = await hash(password, 8);
		const hashConfirmPassword = await hash(confirm_password, 8);

		const newUser = await this.usersRepository.create({
			name,
			email,
			password: hashPassword,
			confirm_password: hashConfirmPassword,
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

	async findById(id: string): Promise<IFindUniqueUser> {
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
						permission: {
							select: {
								key: true,
							},
						},
					},
				},
			},
			where: {
				id,
			},
		});

		const { permissionsUsers, rolesUsers, ...rest } = user;
		const userResponse: IFindUniqueUser = rest;

		return userResponse;
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
