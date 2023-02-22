import { Roles } from '@prisma/client';

export interface ICreateRoleDTO {
	key: string;
	display_name: string;
	description?: string;
}

export interface IUpdateRoleDTO extends ICreateRoleDTO {
	id: number;
}

export interface IIndexRequest {
	key?: string;
	display_name?: string;
}

export interface IRolesRepository {
	create(data: ICreateRoleDTO): Promise<Roles>;
	update(data: IUpdateRoleDTO): Promise<Roles>;
	delete(id: number): Promise<void>;
	getAll({ key, display_name }: IIndexRequest): Promise<Roles[]>;
	findById(id: number): Promise<Roles>;
}
