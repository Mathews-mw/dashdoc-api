import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

import auth from '../config/auth';

interface IPayload {
	sub: string;
}

// eslint-disable-next-line require-await
export async function ensureAuthenticate(request: Request, response: Response, next: NextFunction) {
	const authHeader = request.headers.authorization;

	if (!authHeader) {
		return response.status(401).json({ error: 'Token missing!' });
	}

	const [, token] = authHeader.split(' ');

	try {
		const { sub: user_id } = verify(token, auth.secret_token) as IPayload;

		request.user = {
			id: user_id,
		};

		return next();
	} catch (error: any) {
		const { expiredAt } = error;

		if (expiredAt) {
			return response.status(401).json({ error: auth.expires_token_message_error });
		}

		return response.status(401).json({ error: 'Token invalid' });
	}
}
