import { Request, Response } from 'express';
import { z } from 'zod';

import { HandleErrors } from '../../../../shared/errors/HandleErrors';
import { RolesUseCase } from '../../usecases/rolesUC/RolesUseCase';

export class RolesController {
	async handleCreate(request: Request, response: Response): Promise<Response> {
		const roleCreateBody = z.object({
			key: z.string(),
			display_name: z.string(),
			description: z.optional(z.string()),
		});

		const { key, display_name, description } = roleCreateBody.parse(request.body);

		try {
			const rolesUseCase = new RolesUseCase();
			await rolesUseCase.create({
				key,
				display_name,
				description,
			});

			return response.status(201).json({ message: 'Função criada com sucesso' });
		} catch (error) {
			console.log(error);
			return response.status(400).json({ error: 'Erro ao tentar criar função' });
		}
	}

	async handleUpdate(request: Request, response: Response): Promise<Response> {
		const roleUpdateBody = z.object({
			id: z.string().transform((data) => Number(data)),
		});

		const { id } = roleUpdateBody.parse(request.params);
		const { key, display_name, description } = request.body;

		if (!id) {
			return response.status(404).json({ error: 'Parâmetro não encontrado' });
		}

		try {
			const rolesUseCase = new RolesUseCase();
			const result = await rolesUseCase.update({
				id,
				key,
				display_name,
				description,
			});

			if (!result) {
				return response.status(400).json({ error: 'Nenhuma função foi atualizada' });
			}

			return response.status(200).json({ message: 'Função atualizada com sucesso' });
		} catch (error) {
			console.log(error);
			return response.status(400).json({ error: 'Erro ao tentar atualizar função' });
		}
	}

	async handleDelete(request: Request, response: Response): Promise<Response> {
		const roleDeleteBody = z.object({
			id: z.string().transform((data) => Number(data)),
		});

		const { id } = roleDeleteBody.parse(request.params);

		if (!id) {
			return response.status(404).json({ error: 'Parâmetro não encontrado' });
		}

		try {
			const rolesUseCase = new RolesUseCase();

			await rolesUseCase.delete(id);

			return response.json({ message: 'Função deletada com sucesso' });
		} catch (error) {
			console.log(error);
			return response.status(400).json({ error: 'Erro ao tentar deletar função' });
		}
	}

	async handleIndex(request: Request, response: Response): Promise<Response> {
		const indexQuery = z.object({
			key: z.optional(z.string()),
			display_name: z.optional(z.string()),
		});

		const { key, display_name } = indexQuery.parse(request.query);

		try {
			const rolesUseCase = new RolesUseCase();

			const permissions = await rolesUseCase.getAll({ key, display_name });

			return response.json(permissions);
		} catch (error) {
			console.log(error);
			return response.status(400).json({ error: 'Erro ao tentar listar funções' });
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
			const rolesUseCase = new RolesUseCase();

			const permission = await rolesUseCase.findById(id);

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
