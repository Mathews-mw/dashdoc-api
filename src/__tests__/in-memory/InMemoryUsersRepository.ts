/* eslint-disable require-await */
import { Users } from '@prisma/client';
import { v4 as uuidV4 } from 'uuid';

import { ICreateUserDTO, IUpdateUserDTO, IUserRepository } from '../../modules/repositories/interfaces/IUserRepository';

export class InMemoryUsersRepository implements IUserRepository {
	public users: Users[] = [];

	async create(data: ICreateUserDTO): Promise<Users> {
		const { name, email, password, confirm_password } = data;

		const newUser = {
			id: uuidV4(),
			name,
			email,
			password,
			confirm_password,
			created_at: new Date(),
			phone_number: null,
			bio: null,
			cpf: null,
			company: null,
			updated_at: null,
		};

		this.users.push(newUser);

		return newUser;
	}

	async update(data: IUpdateUserDTO): Promise<Users> {
		throw new Error('Method not implemented.');
	}

	async delete(id: string): Promise<void> {
		throw new Error('Method not implemented.');
	}

	async gettAllUsers(): Promise<Partial<Users>[]> {
		throw new Error('Method not implemented.');
	}

	async findById(id: string): Promise<Partial<Users>> {
		return this.users.find((user) => user.id === id) as Users;
	}

	async findByEmail(email: string): Promise<Partial<Users>> {
		return this.users.find((user) => user.email === email) as Users;
	}

	async findByCpf(cpf: string): Promise<Partial<Users>> {
		return this.users.find((user) => user.cpf === cpf) as Users;
	}
}
