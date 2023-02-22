import { v4 as uuidV4 } from 'uuid';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { Users } from '@prisma/client';
import { inject, injectable } from 'tsyringe';

import auth from '../../../../config/auth';
import { prisma } from '../../../../database/prismaClient';
import { HandleErrors } from '../../../../shared/errors/HandleErrors';
import { DateProvider } from '../../../../shared/providers/DateProvider';
import { RedisCacheProvider } from '../../../../shared/providers/CacheProvider';
import { IDateProvider } from '../../../../shared/providers/interfaces/IDateProvider';
import { ICacheProvider } from '../../../../shared/providers/interfaces/ICacheProvider';

interface IRequest {
	login: string;
	password: string;
}

interface UserResponse extends Partial<Users> {
	permissions?: string[];
	roles?: string[];
}

interface IResponse {
	user: UserResponse;
	token: string;
	refresh_token: string;
	temporaryToken: string;
	expiresInMinutes: number;
}

@injectable()
export class AuthUseCase {
	constructor(
		@inject(DateProvider)
		private dateProvider: IDateProvider,
		@inject(RedisCacheProvider)
		private cacheProvider: ICacheProvider // eslint-disable-next-line no-empty-function
	) {}

	async execute({ login, password }: IRequest): Promise<IResponse> {
		const user = await prisma.users.findFirstOrThrow({
			where: {
				email: login,
			},
		});

		if (!user) {
			throw new HandleErrors('Email ou senha inválidos!');
		}

		const passwordMatch = await compare(password, user.password);

		if (!passwordMatch) {
			throw new HandleErrors('Email ou senha inválidos!');
		}

		const { secret_token, secret_refresh_token, expires_in_token, expires_in_refresh_token, expires_in_refresh_token_days, cache_temporary_token_prefix, cache_temporary_token_expiration_minutes } = auth;

		const userResponse: UserResponse = user;

		const userPermissions = await prisma.permissionsUsers.findMany({
			where: {
				id_user: user?.id,
			},
			include: {
				permission: {
					select: {
						key: true,
					},
				},
			},
		});

		if (userPermissions) {
			userResponse.permissions = userPermissions.map((userPermission) => {
				return userPermission.permission.key;
			});
		}

		const userRoles = await prisma.rolesUsers.findMany({
			where: {
				id_user: user?.id,
			},
			include: {
				roles: {
					select: {
						key: true,
					},
				},
			},
		});

		if (userRoles) {
			userResponse.roles = userRoles.map((userRole) => {
				return userRole.roles.key;
			});
		}

		const { password: userPassword, confirm_password, ...rest } = userResponse;
		const token = sign(rest, secret_token, {
			subject: user.id,
			expiresIn: expires_in_token,
		});

		const refreshToken = sign({ email: login }, secret_refresh_token, {
			subject: user.id,
			expiresIn: expires_in_refresh_token,
		});

		const refreshTokenExpiresDate = this.dateProvider.addDays(expires_in_refresh_token_days);

		await prisma.usersTokens.create({
			data: {
				user_id: user.id,
				refresh_token: refreshToken,
				expires_date: refreshTokenExpiresDate,
			},
		});

		const temporaryToken = uuidV4();

		await this.cacheProvider.set({
			prefix: cache_temporary_token_prefix,
			key: temporaryToken,
			value: user.id,
			expirationInSeconds: cache_temporary_token_expiration_minutes * 60,
		});

		return {
			user: rest,
			token,
			refresh_token: refreshToken,
			temporaryToken,
			expiresInMinutes: cache_temporary_token_expiration_minutes,
		};
	}
}
