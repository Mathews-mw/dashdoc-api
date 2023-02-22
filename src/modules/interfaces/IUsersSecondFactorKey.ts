import { UsersSecondFactorKey } from '@prisma/client';

export interface IGenerateDTO {
	user_id: string;
	key: string;
	validated: boolean;
}

export interface IResponse {
	user_id: string;
	qrcode_url: string;
}

export interface IValidate2faKeyProps {
	user_id: string;
	totp_code: string;
}

export interface IValidate2faKeyResponse {
	isCorrect: boolean;
	message: string;
}

export interface IUsersSecondFactorKey {
	generate(user_id: string): Promise<IResponse>;
	validate2faKey({ user_id, totp_code }: IValidate2faKeyProps): Promise<IValidate2faKeyResponse>;
}
