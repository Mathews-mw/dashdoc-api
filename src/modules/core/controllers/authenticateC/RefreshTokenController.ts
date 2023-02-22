import { Request, Response } from 'express';
import { container } from 'tsyringe';

import auth from '../../../../config/auth';
import { RefreshTokenUseCase } from '../../usecases/authenticateUC/RefreshTokenUseCase';

export class RefreshTokenController {
	async handle(request: Request, response: Response): Promise<Response> {
		const token = request.body.token || request.headers['x-acess-token'] || request.query.token;

		try {
			const refreshTokenUseCase = container.resolve(RefreshTokenUseCase);
			const refreshToken = await refreshTokenUseCase.create(token);

			if (!refreshToken) {
				return response.status(401).json({ error: 'Token invalid!' });
			}

			return response.json(refreshToken);
		} catch (error: any) {
			const { expiredAt } = error;
			if (expiredAt) {
				return response.status(401).json({ error: auth.expires_token_message_error });
			}

			return response.status(400).json({ error: 'Erro ao tentar validar Refresh Token' });
		}
	}
}
