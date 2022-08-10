import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import fs from 'fs';
import multer from 'multer';
import cors from 'cors';

import './core/db.js';

import { checkAuth } from './utils/index.js';

import routes from './routes/index.js';

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads');
    }
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

routes(app);

const port = process.env.PORT || 4444;

app.listen(port, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log(`Server listening on port: ${port}`);
});
