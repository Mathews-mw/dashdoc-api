import { Permissions } from '@prisma/client';

export interface ICreatePermissionDTO {
	key: string;
	display_name: string;
	description?: string;
}

export interface IUpdatePermissionDTO extends ICreatePermissionDTO {
	id: number;
}

export interface IIndexRequest {
	key?: string;
	display_name?: string;
}

export interface IPermissionsRepository {
	create(data: ICreatePermissionDTO): Promise<Permissions>;
	update(data: IUpdatePermissionDTO): Promise<Permissions>;
	delete(id: number): Promise<void>;
	getAll({ key, display_name }: IIndexRequest): Promise<Permissions[]>;
	findById(id: number): Promise<Permissions>;
}
