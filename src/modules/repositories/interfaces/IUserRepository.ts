import { Users } from '@prisma/client';

export interface ICreateUserDTO {
	name: string;
	email: string;
	password: string;
	confirm_password: string;
}

export interface IUpdateUserDTO {
	name?: string;
	email?: string;
	phone_number?: string;
	cpf?: string;
	bio?: string;
	company?: string;
	updated_at: Date;
}

export interface IUserRepository {
	create(data: ICreateUserDTO): Promise<Users>;
	update(user_id: string, data: IUpdateUserDTO): Promise<Users>;
	delete(user_id: string): Promise<void>;
	gettAllUsers(): Promise<Partial<Users>[]>;
	findById(user_id: string): Promise<Users>;
	findByEmail(email: string): Promise<Users>;
	findByCpf(cpf: string): Promise<Users>;
}
