import { hash } from 'bcryptjs';
import { inject, injectable } from 'tsyringe';
import { Users, Permissions, Roles } from '@prisma/client';

import { prisma } from '../../../../database/prismaClient';
import { UsersRepository } from '../../../repositories/UsersRepository';
import { IUserRepository } from '../../../repositories/interfaces/IUserRepository';

import { UsersUseCaseErrors } from './UsersUseCaseErrors';

interface ICreateUserRequest {
	name: string;
	email: string;
	password: string;
	confirm_password: string;
}

interface IUpdateUserRequest {
	name?: string;
	email?: string;
	phone_number?: string;
	cpf?: string;
	bio?: string;
	company?: string;
}

interface IUserResponse extends Partial<Users> {
	permission?: string;
	roles?: string[];
}

interface IUserDTO extends Users {
	permissionsUsers: {
		permission: Pick<Permissions, 'key'>;
	};
	rolesUsers: {
		roles: Pick<Roles, 'key'>;
	}[];
}

@injectable()
export class UsersUseCase {
	constructor(
		@inject(UsersRepository)
		private usersRepository: IUserRepository // eslint-disable-next-line no-empty-function
	) {}

	async create(data: ICreateUserRequest): Promise<Users> {
		const { name, email, password, confirm_password } = data;

		const userAlredyExists = await this.usersRepository.findByEmail(email);

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

	async update(user_id: string, data: IUpdateUserRequest): Promise<Users> {
		const { name, email, phone_number, cpf, bio, company } = data;

		const updatedUser = await this.usersRepository.update(user_id, {
			name,
			email,
			phone_number,
			cpf,
			bio,
			company,
			updated_at: new Date(),
		});

		return updatedUser;
	}

	async delete(user_id: string): Promise<void> {
		await this.usersRepository.delete(user_id);
	}

	async gettAllUsers(): Promise<Partial<Users>[]> {
		const users = await this.usersRepository.gettAllUsers();

		return users;
	}

	async findById(user_id: string): Promise<IUserResponse> {
		const user = (await this.usersRepository.findById(user_id)) as IUserDTO;

		let permission: string | undefined;
		let roles: string[] | undefined;

		if (user && user.permissionsUsers) {
			permission = user.permissionsUsers.permission.key;
		}

		if (user && user.rolesUsers?.length > 0) {
			roles = user.rolesUsers.map((role) => {
				return role.roles.key;
			});
		}

		return {
			id: user.id,
			name: user.name,
			email: user.email,
			phone_number: user.phone_number,
			cpf: user.cpf,
			company: user.company,
			bio: user.bio,
			created_at: user.created_at,
			updated_at: user.updated_at,
			permission,
			roles,
		};
	}

	async findByCpf(cpf: string): Promise<Partial<Users>> {
		const user = await this.usersRepository.findByCpf(cpf);

		return {
			id: user.id,
			name: user.name,
			email: user.email,
			phone_number: user.phone_number,
			cpf: user.cpf,
			company: user.company,
			bio: user.bio,
			created_at: user.created_at,
			updated_at: user.updated_at,
		};
	}

	async findByEmail(email: string): Promise<Partial<Users>> {
		const user = await this.usersRepository.findByEmail(email);

		return {
			id: user.id,
			name: user.name,
			email: user.email,
			phone_number: user.phone_number,
			cpf: user.cpf,
			company: user.company,
			bio: user.bio,
			created_at: user.created_at,
			updated_at: user.updated_at,
		};
	}
}
