import { Request, Response } from 'express';
import { z } from 'zod';

import { HandleErrors } from '../../../../shared/errors/HandleErrors';
import { RolesUsersUseCase } from '../../usecases/rolesUC/RolesUsersUseCase';

export class RolesUsersController {
	async handleCreate(request: Request, response: Response): Promise<Response> {
		const roleCreateBody = z.object({
			roles: z.array(
				z.object({
					id_role: z.number(),
					id_user: z.string(),
				})
			),
		});

		const { roles } = roleCreateBody.parse(request.body);

		try {
			const rolesUsersUseCase = new RolesUsersUseCase();
			const result = await rolesUsersUseCase.create({
				roles,
			});

			return response.status(201).json({ message: `Função criada com sucesso. ${result} registros inseridos.` });
		} catch (error) {
			if (error instanceof HandleErrors) {
				return response.status(error.statusCode).json({ error: error.message });
			}

			return response.status(400).json({ error: 'Erro ao tentar criar função' });
		}
	}

	async handleUpdate(request: Request, response: Response): Promise<Response> {
		const { userId } = request.params;

		if (!userId) {
			return response.status(404).json({ error: 'Parâmetro não encontrado' });
		}

		const userRolesUpdateBody = z.object({
			roles: z.array(
				z.object({
					id_role: z.number(),
					id_user: z.string(),
				})
			),
		});

		const { roles } = userRolesUpdateBody.parse(request.body);

		try {
			const rolesUsersUseCase = new RolesUsersUseCase();

			const result = await rolesUsersUseCase.update({
				roles,
				id_user: userId,
			});

			return response.status(200).json({ message: 'Funções atualizadas com sucesso', count: result });
		} catch (error) {
			console.log(error);
			return response.status(400).json({ error: 'Erro ao tentar atualizar funções' });
		}
	}

	async handleDelete(request: Request, response: Response): Promise<Response> {
		const { userId } = request.params;

		if (!userId) {
			return response.status(404).json({ error: 'Parâmetro não encontrado' });
		}

		const userRolesDeleteBody = z.object({
			rolesToDelete: z.array(z.number()),
		});

		const { rolesToDelete } = userRolesDeleteBody.parse(request.body);

		try {
			const rolesUsersUseCase = new RolesUsersUseCase();

			const result = await rolesUsersUseCase.delete({ id_user: userId, multipleRolesId: rolesToDelete });

			return response.json({ message: 'Funções deletada com sucesso', count: result });
		} catch (error) {
			console.log(error);
			return response.status(400).json({ error: 'Erro ao tentar deletar função' });
		}
	}

	async handleIndex(request: Request, response: Response): Promise<Response> {
		const indexQuery = z.object({
			id_role: z.optional(z.string().transform((data) => Number(data))),
			id_user: z.optional(z.string()),
		});

		const { id_role, id_user } = indexQuery.parse(request.query);

		try {
			const rolesUsersUseCase = new RolesUsersUseCase();

			const permissions = await rolesUsersUseCase.getAll({ id_role, id_user });

			return response.json(permissions);
		} catch (error) {
			console.log(error);
			return response.status(400).json({ error: 'Erro ao tentar listar as funções dos usuários' });
		}
	}

	async handleIndexById(request: Request, response: Response): Promise<Response> {
		const roleParams = z.object({
			id: z.string().transform((data) => Number(data)),
		});

		const { id } = roleParams.parse(request.params);

		if (!id) {
			return response.status(404).json({ error: 'Parâmetro não encontrado' });
		}

		try {
			const rolesUsersUseCase = new RolesUsersUseCase();

			const permission = await rolesUsersUseCase.findById(id);

			return response.json(permission);
		} catch (error) {
			if (error instanceof HandleErrors) {
				return response.status(404).json({ message: error.message });
			}
			console.log(error);
			return response.status(400).json({ error: 'Erro ao tentar buscar por função' });
		}
	}
}
