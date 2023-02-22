import 'reflect-metadata';
import 'dotenv/config';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';

import upload from './config/upload';
import { routes } from './routes/index.routes';
import { HandleErrors } from './shared/errors/HandleErrors';

const app = express();
const port = process.env.PORT || 3638;

app.use(express.json());

app.use('/qrcode', express.static(`${upload.tmpFolder}/qrcode`));

app.use(cors());
app.use('/api', routes);

app.use((error: Error, request: Request, response: Response, next: NextFunction) => {
	if (error instanceof HandleErrors) {
		console.log(error.message);
		return response.status(error.statusCode).json({
			status: 'error',
			error: error.message,
		});
	}

	console.log(error.message);
	return response.status(500).json({
		status: 'error',
		error: `Internal server error! - ${error.message}`,
	});
});

app.listen(port, () => {
	return console.log(`Server on! Listen on port ${port}.`);
});
