import Redis from 'ioredis';

import { GetProps, ICacheProvider, SetProps } from './interfaces/ICacheProvider';

export class RedisCacheProvider implements ICacheProvider {
	client: Redis;

	constructor() {
		this.client = this.connect();
	}

	connect(): any {
		const connection = new Redis({
			host: 'localhost',
			port: 6379,
		});

		return connection;
	}

	disconnect() {
		this.client.disconnect();
	}

	async get(data: GetProps): Promise<string | null> {
		const { prefix, key } = data;

		const result = await this.client.get(`${prefix}:${key}`);

		return result;
	}

	async set(data: SetProps): Promise<void> {
		const { prefix, key, value, expirationInSeconds } = data;
		if (expirationInSeconds === 0) {
			await this.client.set(`${prefix}:${key}`, value);
		} else {
			await this.client.set(`${prefix}:${key}`, value, 'EX', expirationInSeconds);
		}
	}

	async delete(prefix: string, key: string): Promise<void> {
		await this.client.del(`${prefix}:${key}`);
	}

	getClientConnection(): any {
		return this.client;
	}
}
