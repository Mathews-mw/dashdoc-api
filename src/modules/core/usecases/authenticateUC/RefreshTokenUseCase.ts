import { Users } from '@prisma/client';
import { sign, verify } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import auth from '../../../../config/auth';
import { prisma } from '../../../../database/prismaClient';
import { HandleErrors } from '../../../../shared/errors/HandleErrors';
import { DateProvider } from '../../../../shared/providers/DateProvider';
import { IDateProvider } from '../../../../shared/providers/interfaces/IDateProvider';

interface IPayload {
	sub: string;
	email: string;
}

interface ITokenResponse {
	token: string;
	refresh_token: string;
}

interface UserResponse extends Partial<Users> {
	permissions?: string[];
	roles?: string[];
}

@injectable()
export class RefreshTokenUseCase {
	constructor(
		@inject(DateProvider)
		private dateProvider: IDateProvider // eslint-disable-next-line no-empty-function
	) {}

	async create(token: string): Promise<ITokenResponse> {
		const { secret_token, secret_refresh_token, expires_in_token, expires_in_refresh_token, expires_in_refresh_token_days } = auth;
		const { sub, email } = verify(token, secret_refresh_token) as IPayload;

		const user_id = sub;

		const userTokens = await prisma.usersTokens.findFirst({
			where: {
				user_id,
				refresh_token: token,
			},
		});

		if (!userTokens) {
			throw new HandleErrors('Refresh token does not exists!');
		}

		await prisma.usersTokens.delete({
			where: {
				id: userTokens.id,
			},
		});

		const refreshToken = sign({ email }, secret_refresh_token, {
			subject: sub,
			expiresIn: expires_in_refresh_token,
		});

		const refreshTokenExpiresDate = this.dateProvider.addDays(expires_in_refresh_token_days);

		await prisma.usersTokens.create({
			data: {
				user_id,
				refresh_token: refreshToken,
				expires_date: refreshTokenExpiresDate,
			},
		});

		const user = await prisma.users.findFirstOrThrow({
			where: {
				id: userTokens.user_id,
			},
		});

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

		const { password, confirm_password, ...rest } = userResponse;
		const newToken = sign(rest, secret_token, {
			subject: user_id,
			expiresIn: expires_in_token,
		});

		return {
			token: newToken,
			refresh_token: refreshToken,
		};
	}
}
