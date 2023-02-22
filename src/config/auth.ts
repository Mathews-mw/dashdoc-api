// eslint-disable-next-line import/no-anonymous-default-export
export default {
	secret_token: `${process.env.SECRET_TOKEN}`,
	secret_refresh_token: `${process.env.SECRET_REFRESH_TOKEN}`,
	expires_in_token: '30m',
	expires_in_refresh_token: '8h',
	expires_in_refresh_token_days: 30,
	expires_token_message_error: 'Token Expired',

	cache_temporary_token_prefix: 'cache_temporary_token_prefix',
	cache_temporary_token_expiration_minutes: 10,
};
