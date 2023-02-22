import { RolesUsers } from '@prisma/client';

export interface ICreateRolesUserDTO {
	roles: Array<{
		id_role: number;
		id_user: string;
	}>;
}

export interface IUpdateRolesUserDTO extends ICreateRolesUserDTO {
	id_user: string;
}

export interface IUpdateRolesUserResponse {
	countDeletedRoles: number;
	countInsertRoles: number;
}

export interface IDeleteRolesUserDTO {
	id_user: string;
	multipleRolesId: Array<number>;
}

export interface IIndexRequest {
	id_role?: number;
	id_user?: string;
}

export interface IRolesUsersImplementations {
	create(data: ICreateRolesUserDTO): Promise<number>;
	update(data: IUpdateRolesUserDTO): Promise<IUpdateRolesUserResponse>;
	delete(data: IDeleteRolesUserDTO): Promise<number>;
	getAll({ id_role, id_user }: IIndexRequest): Promise<Partial<RolesUsers>[]>;
	findById(id: number): Promise<Partial<RolesUsers>>;
}
