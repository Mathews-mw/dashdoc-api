import { Request, Response } from 'express';
import { z } from 'zod';

import { HandleErrors } from '../../../../shared/errors/HandleErrors';
import { PermissionsUseCase } from '../../usecases/permissionsUC/PermissionsUseCase';

export class PermissionsController {
	async handleCreate(request: Request, response: Response): Promise<Response> {
		const permissionCreateBody = z.object({
			key: z.string(),
			display_name: z.string(),
			description: z.optional(z.string()),
		});

		const { key, display_name, description } = permissionCreateBody.parse(request.body);

		try {
			const permissionsUseCase = new PermissionsUseCase();
			await permissionsUseCase.create({
				key,
				display_name,
				description,
			});

			return response.status(201).json({ message: 'Permissão criada com sucesso' });
		} catch (error) {
			console.log(error);
			return response.status(400).json({ error: 'Erro ao tentar criar permissão' });
		}
	}

	async handleUpdate(request: Request, response: Response): Promise<Response> {
		const permissionUpdateBody = z.object({
			id: z.string().transform((data) => Number(data)),
		});

		const { id } = permissionUpdateBody.parse(request.params);
		const { key, display_name, description } = request.body;

		if (!id) {
			return response.status(404).json({ error: 'Parâmetro não encontrado' });
		}

		try {
			const permissionsUseCase = new PermissionsUseCase();
			const result = await permissionsUseCase.update({
				id,
				key,
				display_name,
				description,
			});

			console.log(result);

			if (!result) {
				return response.status(400).json({ error: 'Nenhuma permissão foi atualizada' });
			}

			return response.status(200).json({ message: 'Permissão atualizada com sucesso' });
		} catch (error) {
			console.log(error);
			return response.status(400).json({ error: 'Erro ao tentar atualizar permissão' });
		}
	}

	async handleDelete(request: Request, response: Response): Promise<Response> {
		const permissionDeleteBody = z.object({
			id: z.string().transform((data) => Number(data)),
		});

		const { id } = permissionDeleteBody.parse(request.params);

		if (!id) {
			return response.status(404).json({ error: 'Parâmetro não encontrado' });
		}

		try {
			const permissionsUseCase = new PermissionsUseCase();

			await permissionsUseCase.delete(id);

			return response.json({ message: 'Permissão deletada com sucesso' });
		} catch (error) {
			console.log(error);
			return response.status(400).json({ error: 'Erro ao tentar deletar permissão' });
		}
	}

	async handleIndex(request: Request, response: Response): Promise<Response> {
		const indexQuery = z.object({
			key: z.optional(z.string()),
			display_name: z.optional(z.string()),
		});

		const { key, display_name } = indexQuery.parse(request.query);

		try {
			const permissionsUseCase = new PermissionsUseCase();

			const permissions = await permissionsUseCase.getAll({ key, display_name });

			return response.json(permissions);
		} catch (error) {
			console.log(error);
			return response.status(400).json({ error: 'Erro ao tentar listar permissões' });
		}
	}

	async handleIndexById(request: Request, response: Response): Promise<Response> {
		const permissionParams = z.object({
			id: z.string().transform((data) => Number(data)),
		});

		const { id } = permissionParams.parse(request.params);

		if (!id) {
			return response.status(404).json({ error: 'Parâmetro não encontrado' });
		}

		try {
			const permissionsUseCase = new PermissionsUseCase();

			const permission = await permissionsUseCase.findById(id);

			return response.json(permission);
		} catch (error) {
			if (error instanceof HandleErrors) {
				return response.status(404).json({ message: error.message });
			}
			console.log(error);
			return response.status(400).json({ error: 'Erro ao tentar buscar por permissão' });
		}
	}
}
