import { isDate } from 'util/types';

import { InMemoryUsersRepository } from '../in-memory/InMemoryUsersRepository';
import { UsersUseCase } from '../../modules/core/usecases/usersUC/UsersUseCase';
import { UsersUseCaseErrors } from '../../modules/core/usecases/usersUC/UsersUseCaseErrors';

describe('[Unit Test] Create users service', () => {
	let userUseCase: UsersUseCase;
	let inMemoryUsersRepository: InMemoryUsersRepository;

	beforeEach(() => {
		inMemoryUsersRepository = new InMemoryUsersRepository();
		userUseCase = new UsersUseCase(inMemoryUsersRepository);
	});

	it('Should be able to create a new user', async () => {
		const user = await userUseCase.create({
			name: 'Bryan Nash',
			email: 'ovaozazaw@mo.cl',
			password: 'Gvd!SJ@ks7',
			confirm_password: 'Gvd!SJ@ks7',
		});

		expect(user).toHaveProperty('id');
	});

	it('should NOT be able to crate new user with same email address', async () => {
		await userUseCase.create({
			name: 'Bryan Nash',
			email: 'ovaozazaw@mo.cl',
			password: 'Gvd!SJ@ks7',
			confirm_password: 'Gvd!SJ@ks7',
		});

		await expect(
			userUseCase.create({
				name: 'Bryan Nash',
				email: 'ovaozazaw@mo.cl',
				password: 'Gvd!SJ@ks7',
				confirm_password: 'Gvd!SJ@ks7',
			})
		).rejects.toEqual(new UsersUseCaseErrors.EmailAreadyInUse());
	});

	it('Should be able to update an user', async () => {
		const user = await inMemoryUsersRepository.create({
			name: 'Bryan Nash',
			email: 'ovaozazaw@mo.cl',
			password: 'Gvd!SJ@ks7',
			confirm_password: 'Gvd!SJ@ks7',
		});

		const result = await userUseCase.update(user.id, {
			cpf: '022.999.999.99',
			phone_number: '92 9 8888-9999',
			bio: 'Fullstack Developer',
			company: 'IBM',
		});

		expect(result).toHaveProperty('id');
		expect(result.id).toEqual(user.id);
		expect(result).toHaveProperty('updated_at');
		expect(isDate(result.updated_at)).toBe(true);
	});

	it('Should be able to delete an user', async () => {
		const user = await inMemoryUsersRepository.create({
			name: 'Bryan Nash',
			email: 'ovaozazaw@mo.cl',
			password: 'Gvd!SJ@ks7',
			confirm_password: 'Gvd!SJ@ks7',
		});

		await userUseCase.delete(user.id);

		expect(user.id).not.toHaveProperty('id');
	});

	it('Should be able to list all users', async () => {
		await inMemoryUsersRepository.create({
			name: 'Bryan Nash',
			email: 'ovaozazaw@mo.cl',
			password: 'Gvd!SJ@ks7',
			confirm_password: 'Gvd!SJ@ks7',
		});

		const users = await userUseCase.gettAllUsers();

		expect(users).toHaveLength(1);
	});

	it('Should be able to list user by user_id', async () => {
		const newUser = await inMemoryUsersRepository.create({
			name: 'Bryan Nash',
			email: 'ovaozazaw@mo.cl',
			password: 'Gvd!SJ@ks7',
			confirm_password: 'Gvd!SJ@ks7',
		});

		const user = await userUseCase.findById(newUser.id);

		expect(user).toHaveProperty('id');
	});

	it('Should be able to list user by cpf', async () => {
		const newUser = await inMemoryUsersRepository.create({
			name: 'Bryan Nash',
			email: 'ovaozazaw@mo.cl',
			password: 'Gvd!SJ@ks7',
			confirm_password: 'Gvd!SJ@ks7',
		});

		const userUpdated = await userUseCase.update(newUser.id, {
			cpf: '022.999.999.99',
			phone_number: '92 9 8888-9999',
			bio: 'Fullstack Developer',
			company: 'IBM',
		});

		const user = await userUseCase.findByCpf(userUpdated.cpf as string);

		expect(user).toHaveProperty('cpf');
		expect(user.cpf).toEqual('022.999.999.99');
	});

	it('Should be able to list user by email', async () => {
		const newUser = await inMemoryUsersRepository.create({
			name: 'Bryan Nash',
			email: 'ovaozazaw@mo.cl',
			password: 'Gvd!SJ@ks7',
			confirm_password: 'Gvd!SJ@ks7',
		});

		const user = await userUseCase.findByEmail(newUser.email);

		expect(user).toHaveProperty('email');
		expect(user.email).toEqual('ovaozazaw@mo.cl');
	});
});
