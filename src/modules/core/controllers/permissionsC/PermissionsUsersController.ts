import { Request, Response } from 'express';
import { z } from 'zod';

import { HandleErrors } from '../../../../shared/errors/HandleErrors';
import { PermissionsUsersUsecase } from '../../usecases/permissionsUC/PermissionsUsersUsecase';

export class PermissionsUsersController {
	async handleCreate(request: Request, response: Response): Promise<Response> {
		const createBodySchema = z.object({
			id_user: z.string(),
			id_permission: z.number(),
		});

		const { id_user, id_permission } = createBodySchema.parse(request.body);

		try {
			const permissionsUsersUseCase = new PermissionsUsersUsecase();

			await permissionsUsersUseCase.create({
				id_user,
				id_permission,
			});

			return response.status(201).json({ message: 'Permissão inserida com sucesso' });
		} catch (error) {
			if (error instanceof Error) {
				return response.status(400).json({ error: 'Erro ao tentar inserir permissão', message: error.message });
			}
			if (error instanceof HandleErrors) {
				return response.status(error.statusCode).json({ error: error.message });
			}
			return response.status(400).end();
		}
	}

	async handleUpdate(request: Request, response: Response): Promise<Response> {
		const { userId } = request.params;

		if (!userId) {
			return response.status(404).json({ error: 'Parâmetro não encontrado' });
		}

		const updateBodySchema = z.object({
			id_permission: z.number(),
		});

		const { id_permission } = updateBodySchema.parse(request.body);

		try {
			const permissionsUsersUseCase = new PermissionsUsersUsecase();

			await permissionsUsersUseCase.update({
				id_user: userId,
				id_permission,
			});

			return response.status(200).json({ message: 'Permissão atualizada com sucesso' });
		} catch (error) {
			console.log(error);
			if (error instanceof Error) {
				return response.status(400).json({ error: 'Erro ao tentar atualizar permissão', message: error.message });
			}

			return response.status(400).end();
		}
	}

	async handleDelete(request: Request, response: Response): Promise<Response> {
		const { userId } = request.params;

		if (!userId) {
			return response.status(404).json({ error: 'Parâmetro não encontrado' });
		}

		try {
			const permissionsUsersUseCase = new PermissionsUsersUsecase();

			await permissionsUsersUseCase.delete(userId);

			return response.status(200).json({ message: 'Permissão deletada com sucesso' });
		} catch (error) {
			if (error instanceof Error) {
				return response.status(400).json({ error: 'Erro ao tentar deletar permissão', message: error.message });
			}

			return response.status(400).end();
		}
	}

	async handleGetAll(request: Request, response: Response): Promise<Response> {
		const querySchemaBody = z.object({
			key: z.optional(z.string()),
			display_name: z.optional(z.string()),
		});

		const { key, display_name } = querySchemaBody.parse(request.query);

		try {
			const permissionsUsersUseCase = new PermissionsUsersUsecase();

			const result = await permissionsUsersUseCase.getAll({
				key,
				display_name,
			});

			return response.json(result);
		} catch (error) {
			if (error instanceof Error) {
				return response.status(400).json({ error: 'Erro ao tentar listar permissões dos usuários', message: error.message });
			}

			return response.status(400).end();
		}
	}

	async handleFindByUserId(request: Request, response: Response): Promise<Response> {
		const { userId } = request.params;

		if (!userId) {
			return response.status(404).json({ error: 'Parâmetro não encontrado' });
		}
		try {
			const permissionsUsersUseCase = new PermissionsUsersUsecase();

			const result = await permissionsUsersUseCase.findByUserId(userId);

			return response.status(200).json(result);
		} catch (error) {
			if (error instanceof Error) {
				return response.status(400).json({ error: 'Erro ao tentar listar permissão do usuário', message: error.message });
			}

			return response.status(400).end();
		}
	}
}
