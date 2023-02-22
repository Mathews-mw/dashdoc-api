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

	update(data: IUpdateUserDTO): Promise<Users> {
		throw new Error('Method not implemented.');
	}

	delete(id: string): Promise<void> {
		throw new Error('Method not implemented.');
	}

	gettAllUsers(): Promise<Partial<Users>[]> {
		throw new Error('Method not implemented.');
	}

	findById(id: string): Promise<Partial<Users>> {
		throw new Error('Method not implemented.');
	}

	findByCpf(cpf: string): Promise<Partial<Users>> {
		throw new Error('Method not implemented.');
	}
}
