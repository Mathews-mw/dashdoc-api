import { sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import auth from '../../../../config/auth';
import { prisma } from '../../../../database/prismaClient';
import { HandleErrors } from '../../../../shared/errors/HandleErrors';
import { DateProvider } from '../../../../shared/providers/DateProvider';
import { OTPLibProvider } from '../../../../shared/providers/OTPLibProvider';
import { RedisCacheProvider } from '../../../../shared/providers/CacheProvider';
import { IDateProvider } from '../../../../shared/providers/interfaces/IDateProvider';
import { ICacheProvider } from '../../../../shared/providers/interfaces/ICacheProvider';
import { IOneTimePasswordProvider } from '../../../../shared/providers/interfaces/IOneTimePasswordProvider';

interface IRequest {
	totp_code: string;
	temporaryToken: string;
}

interface IResponse {
	token: string;
	refreshToken: string;
	user: {
		name: string;
		email: string;
	};
}

@injectable()
export class ValidateTwoFactorKeyUseCase {
	constructor(
		@inject(DateProvider)
		private dateProvider: IDateProvider,
		@inject(OTPLibProvider)
		private otp: IOneTimePasswordProvider,
		@inject(RedisCacheProvider)
		private cacheProvider: ICacheProvider // eslint-disable-next-line no-empty-function
	) {}

	async execute({ temporaryToken, totp_code }: IRequest): Promise<IResponse> {
		const user_id = await this.cacheProvider.get({ prefix: auth.cache_temporary_token_prefix, key: temporaryToken });

		if (!user_id) {
			throw new HandleErrors('The provided temporary token is incorrect or already expires', 404);
		}

		const userSecondFactorData = await prisma.usersSecondFactorKey.findUniqueOrThrow({
			where: {
				user_id_validated: {
					user_id,
					validated: true,
				},
			},
		});

		if (!userSecondFactorData) {
			throw new HandleErrors('This code is not correct. Try again', 403);
		}

		const { key } = userSecondFactorData;

		const isCorrect = this.otp.verifyToken(totp_code, key);

		if (!isCorrect) {
			throw new HandleErrors('No valid keys was found for this user', 404);
		}

		const user = await prisma.users.findUniqueOrThrow({
			where: {
				id: user_id,
			},
		});

		const token = sign({}, auth.secret_token, {
			subject: user.id,
			expiresIn: auth.expires_in_token,
		});

		const refreshToken = sign({ email: user.email }, auth.secret_refresh_token, {
			subject: user.id,
			expiresIn: auth.expires_in_refresh_token,
		});

		const refreshTokenExpiresDate = this.dateProvider.addDays(auth.expires_in_refresh_token_days);

		await prisma.usersTokens.create({
			data: {
				user_id,
				refresh_token: refreshToken,
				expires_date: refreshTokenExpiresDate,
			},
		});

		return {
			token,
			refreshToken,
			user: {
				email: user.email,
				name: user.name,
			},
		};
	}
}
