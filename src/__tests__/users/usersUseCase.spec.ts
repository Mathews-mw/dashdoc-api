import { v4 as uuidV4 } from 'uuid';

import { UsersUseCase } from '../../modules/core/usecases/usersUC/UsersUseCase';
import { UsersUseCaseErrors } from '../../modules/core/usecases/usersUC/UsersUseCaseErrors';
import { InMemoryUsersRepository } from '../in-memory/InMemoryUsersRepository';

let userUseCase: UsersUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe('[Unit Test] Create users service', () => {
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
});
