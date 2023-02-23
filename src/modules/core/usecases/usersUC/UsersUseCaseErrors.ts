import { HandleErrors } from '../../../../shared/errors/HandleErrors';

export namespace UsersUseCaseErrors {
	export class EmailAreadyInUse extends HandleErrors {
		constructor() {
			super('Esse e-mail já está sendo usado', 404);
		}
	}
}
