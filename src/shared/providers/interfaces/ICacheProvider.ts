export interface GetProps {
	prefix: string;
	key: string;
}

export interface SetProps {
	prefix: string;
	key: string;
	value: string;
	expirationInSeconds: number;
}

export interface ICacheProvider {
	disconnect(): void;
	get(data: GetProps): Promise<string | null>;
	set(data: SetProps): Promise<void>;
	delete(prefix: string, key: string): Promise<void>;
}
