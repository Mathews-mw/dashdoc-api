import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { z, ZodError } from 'zod';

import { HandleErrors } from '../../../../shared/errors/HandleErrors';
import { AuthUseCase } from '../../usecases/authenticateUC/AuthUseCase';

export class AuthController {
	async handle(request: Request, response: Response): Promise<Response> {
		const authenticateBody = z.object({
			login: z.string(),
			password: z.string(),
		});

		const { login, password } = authenticateBody.parse(request.body);

		try {
			const authUseCase = container.resolve(AuthUseCase);
			const token = await authUseCase.execute({ login, password });

			return response.json(token);
		} catch (error: any) {
			console.log(error);
			return response.status(400).json({ error: 'Erro ao tentar se autenticar', message: error.message });
		}
	}
}
