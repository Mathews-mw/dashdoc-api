import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { ValidateTwoFactorKeyUseCase } from '../../usecases/authenticateUC/ValidateTwoFactorKeyUseCase';

export class ValidateTowFactorKeyController {
	async handle(request: Request, response: Response): Promise<Response> {
		const { totp_code, temporaryToken } = request.body;

		try {
			const validateTwoFactorKeyUseCase = container.resolve(ValidateTwoFactorKeyUseCase);

			const token = await validateTwoFactorKeyUseCase.execute({
				totp_code,
				temporaryToken,
			});

			return response.status(200).json(token);
		} catch (error) {
			console.log(error);
			return response.status(404).json({ error: 'Erro ao tentar se autenticar' });
		}
	}
}
