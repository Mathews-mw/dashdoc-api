import { PermissionsUsers } from '@prisma/client';

export interface ICreatePermissionUserDTO {
	id_permission: number;
	id_user: string;
}

export interface IUpdatePermissionUserDTO extends ICreatePermissionUserDTO {}

export interface IIndexRequest {
	key?: string;
	display_name?: string;
}

export interface IPermissionsUsers {
	create(data: ICreatePermissionUserDTO): Promise<PermissionsUsers>;
	update(data: IUpdatePermissionUserDTO): Promise<PermissionsUsers>;
	delete(id_user: string): Promise<void>;
	getAll(data: IIndexRequest): Promise<PermissionsUsers[]>;
	findByUserId(userId: string): Promise<PermissionsUsers>;
}
