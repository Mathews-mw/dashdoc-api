import { z } from 'zod';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { UsersUseCase } from '../../usecases/usersUC/UsersUseCase';

export class UserController {
	async handleCreate(request: Request, response: Response): Promise<Response> {
		const createUserBody = z
			.object({
				name: z.string(),
				email: z.string().email(),
				password: z.string().min(6, { message: 'Senha deve conter no mínimo 6 caracteres.' }),
				confirm_password: z.string().min(6),
			})
			.refine((data) => data.password === data.confirm_password, {
				message: 'Senhas não conferem.',
				path: ['confirm_password'],
			});

		const { name, email, password, confirm_password } = createUserBody.parse(request.body);

		try {
			const useUserCase = container.resolve(UsersUseCase);
			const result = await useUserCase.create({
				name,
				email,
				password,
				confirm_password,
			});

			return response.status(201).json({ message: `${result.name.split(' ')[0]}, seu cadastro foi concluído` });
		} catch (error) {
			console.log(error);
			return response.status(400).json(error);
		}
	}

	async handleUpdate(request: Request, response: Response): Promise<Response> {
		const { id } = request.user;

		if (!id) {
			return response.status(404).json({ error: 'Usuario não encontrado' });
		}

		const createUserBody = z.object({
			name: z.string().optional(),
			email: z.string().email().optional(),
			phone_number: z
				.string()
				.optional()
				.transform((data) => (data ? data.split('-').join('').replace('(', '').replace(')', '').replace(' ', '') : undefined)),
			cpf: z
				.string()
				.optional()
				.transform((data) => (data ? data.split('.').join('').replace('-', '') : undefined)),
			bio: z.string().optional(),
			company: z.string().optional(),
		});

		const { name, email, phone_number, cpf, bio, company } = createUserBody.parse(request.body);

		try {
			const useUserCase = container.resolve(UsersUseCase);
			const result = await useUserCase.update({
				id,
				name,
				email,
				phone_number,
				cpf,
				bio,
				company,
			});

			if (!result) {
				return response.status(404).json({ error: 'Nenhum usuário atualizado' });
			}

			return response.status(200).json({ message: `${result.name.split(' ')[0]}, seus dados foram atualizados` });
		} catch (error) {
			console.log(error);
			return response.status(400).json(error);
		}
	}

	async handleDelete(request: Request, response: Response): Promise<Response> {
		const { id } = request.params;

		if (!id) {
			return response.status(404).json({ error: 'Usuario não encontrado' });
		}

		try {
			const usersUseCase = container.resolve(UsersUseCase);

			await usersUseCase.delete(id);

			return response.json({ message: 'Usuário deletado com sucesso' });
		} catch (error) {
			console.log(error);
			return response.status(400).json({ error: 'Erro ao tentar deletar usuário' });
		}
	}

	async handleIndex(request: Request, response: Response): Promise<Response> {
		try {
			const usersUseCase = container.resolve(UsersUseCase);
			const users = await usersUseCase.gettAllUsers();

			return response.json(users);
		} catch (error: any) {
			console.log(error);
			return response.status(400).json({ error: 'Erro ao tentar listar usuários', message: error.toString() });
		}
	}

	async handleIndexByUserId(request: Request, response: Response): Promise<Response> {
		const { id } = request.params;

		if (!id) {
			return response.status(403).json({ error: 'Sem autorização' });
		}

		try {
			const usersUseCase = container.resolve(UsersUseCase);
			const user = await usersUseCase.findById(id);

			return response.json(user);
		} catch (error: any) {
			console.log(error);
			return response.status(400).json({ error: 'Erro ao tentar procurar usuário', message: error.toString() });
		}
	}
}
