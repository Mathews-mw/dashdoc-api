import { Users } from '@prisma/client';

export interface ICreateUserDTO {
	name: string;
	email: string;
	password: string;
	confirm_password: string;
}

export interface IUpdateUserDTO {
	id: string;
	name?: string;
	email?: string;
	phone_number?: string;
	cpf?: string;
	bio?: string;
	company?: string;
}

export interface IUserRepository {
	create(data: ICreateUserDTO): Promise<Users>;
	update(data: IUpdateUserDTO): Promise<Users>;
	delete(id: string): Promise<void>;
	gettAllUsers(): Promise<Partial<Users>[]>;
	findById(id: string): Promise<Partial<Users>>;
	findByEmail(email: string): Promise<Partial<Users>>;
	findByCpf(cpf: string): Promise<Partial<Users>>;
}
