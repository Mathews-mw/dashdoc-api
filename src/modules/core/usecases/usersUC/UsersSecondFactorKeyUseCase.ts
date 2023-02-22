import QRCode from 'qrcode';
import { inject, injectable } from 'tsyringe';

import upload from '../../../../config/upload';
import { prisma } from '../../../../database/prismaClient';
import { HandleErrors } from '../../../../shared/errors/HandleErrors';
import { deleteFile, fileExists } from '../../../../utils/fileManager';
import { OTPLibProvider } from '../../../../shared/providers/OTPLibProvider';
import { LocalStorageProvider } from '../../../../shared/providers/LocalStorageProvider';
import { IStorageProvider } from '../../../../shared/providers/interfaces/IStorageProvider';
import { IOneTimePasswordProvider } from '../../../../shared/providers/interfaces/IOneTimePasswordProvider';
import { IUsersSecondFactorKey, IGenerateDTO, IResponse, IValidate2faKeyProps, IValidate2faKeyResponse } from '../../../interfaces/IUsersSecondFactorKey';

@injectable()
export class UserSecondFactorKeyUseCase implements IUsersSecondFactorKey {
	constructor(
		@inject(OTPLibProvider)
		private otp: IOneTimePasswordProvider,
		@inject(LocalStorageProvider)
		private storageProvider: IStorageProvider // eslint-disable-next-line no-empty-function
	) {}

	async generate(user_id: string): Promise<IResponse> {
		const user = await prisma.users.findUniqueOrThrow({
			where: {
				id: user_id,
			},
			include: {
				usersSecondFactorKey: true,
			},
		});

		if (!user) {
			throw new HandleErrors('User not found!');
		}

		if (user && Boolean(user.usersSecondFactorKey?.user_id)) {
			await prisma.usersSecondFactorKey.delete({
				where: {
					user_id_validated: {
						validated: false,
						user_id,
					},
				},
			});
		}

		const key = this.otp.generateBase32Key();
		await prisma.usersSecondFactorKey.create({
			data: {
				user_id,
				key,
				validated: false,
			},
		});

		const fileName = `${user_id}.png`;
		const fileDirTmp = `${upload.tmpFolder}/${fileName}`;
		await deleteFile(fileName);

		const keyName = 'Node 2FA';
		const uri = this.otp.generateKeyURI(user.email, keyName, key);

		try {
			await QRCode.toFile(fileDirTmp, uri, {});
		} catch (error) {
			throw new HandleErrors('Cannot generate a QR Code image');
		}

		if (fileExists(fileDirTmp)) {
			await this.storageProvider.save(fileName, 'qrcode');
		} else {
			throw new HandleErrors('QR Code not found!');
		}

		const qrcode_url = `${process.env.APP_API_URL}/qrcode/${fileName}`;

		return {
			user_id,
			qrcode_url,
		};
	}

	async validate2faKey({ user_id, totp_code }: IValidate2faKeyProps): Promise<IValidate2faKeyResponse> {
		const user2faData = await prisma.usersSecondFactorKey.findUniqueOrThrow({
			where: {
				user_id_validated: {
					user_id,
					validated: false,
				},
			},
		});

		if (!user2faData) {
			throw new HandleErrors('There is no keys pending of validations. Try generate a new two-factor key');
		}

		const { key } = user2faData;

		console.log('key: ', key);
		console.log('totp_code: ', totp_code);
		const isCorrect = this.otp.verifyToken(totp_code, key);

		if (!isCorrect) {
			throw new HandleErrors('This code is not correct. Try again');
		}

		if (user2faData.validated === true) {
			await prisma.usersSecondFactorKey.delete({
				where: {
					user_id_validated: {
						user_id,
						validated: true,
					},
				},
			});
		}

		await prisma.usersSecondFactorKey.update({
			where: {
				user_id_validated: {
					user_id,
					validated: false,
				},
			},
			data: {
				validated: true,
				validated_at: new Date(),
			},
		});

		return {
			isCorrect,
			message: 'All set up. This will be your new key for two-factor authentication',
		};
	}
}
