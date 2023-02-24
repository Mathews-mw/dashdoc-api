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

	async update(user_id: string, data: IUpdateUserDTO): Promise<Users> {
		const findUserIndex = this.users.findIndex((user) => user.id === user_id);

		const user = { ...this.users[findUserIndex], ...data };

		this.users[findUserIndex].updated_at = new Date();
		this.users[findUserIndex] = user;

		return user;
	}

	async delete(user_id: string): Promise<void> {
		const findUserIndex = this.users.findIndex((user) => user.id === user_id);

		this.users.splice(findUserIndex, 1);
	}

	async gettAllUsers(): Promise<Partial<Users>[]> {
		return this.users;
	}

	async findById(user_id: string): Promise<Users> {
		return this.users.find((user) => user.id === user_id) as Users;
	}

	async findByEmail(email: string): Promise<Users> {
		return this.users.find((user) => user.email === email) as Users;
	}

	async findByCpf(cpf: string): Promise<Users> {
		return this.users.find((user) => user.cpf === cpf) as Users;
	}
}
