import { v4 as uuidV4 } from 'uuid';

import { UsersUseCase } from '../../modules/core/usecases/usersUC/UsersUseCase';
import { HandleErrors } from '../../shared/errors/HandleErrors';
import { InMemoryUsersRepository } from '../in-memory/InMemoryUsersRepository';

let userUseCase: UsersUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe('[Unit Test] Create users service', () => {
	beforeEach(() => {
		inMemoryUsersRepository = new InMemoryUsersRepository();
		userUseCase = new UsersUseCase(inMemoryUsersRepository);
	});

	const newUser = {
		id: uuidV4(),
		name: 'Mathews Araujo',
		email: 'mathews@email.exemplo.com',
		password: 'math@123',
		confirm_password: 'math@123',
	};

	it('Should be able to create a new user', async () => {
		await expect(userUseCase.create(newUser)).resolves.not.toThrow();

		expect(inMemoryUsersRepository.users).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					name: 'Mathews Araujo',
				}),
			])
		);
	});

	it('should NOT be able to crate new user with same email address', async () => {
		await userUseCase.create(newUser);

		expect(async () => {
			await userUseCase.create(newUser);
		}).rejects.toThrowError();

		// expect(inMemoryUsersRepository.users).toEqual(expect.arrayContaining.length === 1);
	});
});
