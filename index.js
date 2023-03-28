import dotenv from 'dotenv';
dotenv.config();

import cloudinary from 'cloudinary';
import cors from 'cors';
import express from 'express';

import './core/db.js';

import routes from './routes/index.js';

const port = process.env.PORT || 8080;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

routes(app);

app.listen(port, (err) => {
	if (err) {
		return console.log(err);
	}

	console.log(`Server listening on port: ${port}`);
});
