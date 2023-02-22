import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { UserSecondFactorKeyUseCase } from '../../usecases/usersUC/UsersSecondFactorKeyUseCase';

export class UsersSecondFactorKeyController {
	async handleGenerate(request: Request, response: Response): Promise<Response> {
		const { user_id } = request.body;

		try {
			const usersSecondFactorKeyUserCase = container.resolve(UserSecondFactorKeyUseCase);

			const key = await usersSecondFactorKeyUserCase.generate(user_id);

			return response.status(201).json(key);
		} catch (error) {
			console.log(error);
			return response.status(400).json({ error: 'Erro ao tentar gerar QR Code para chave 2 de fatores' });
		}
	}

	async handleValidate2faKey(request: Request, response: Response): Promise<Response> {
		const { user_id, totp_code } = request.body;

		try {
			const usersSecondFactorKeyUserCase = container.resolve(UserSecondFactorKeyUseCase);

			const result = await usersSecondFactorKeyUserCase.validate2faKey({ user_id, totp_code });

			return response.status(200).json(result);
		} catch (error) {
			console.log(error);
			return response.status(400).json({ error: 'Erro ao tentar validar chave de 2 fatores' });
		}
	}
}
