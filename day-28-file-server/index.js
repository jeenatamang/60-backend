import 'dotenv/config';
import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import AppError from './utils/Apperror.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); 
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'text/plain'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); 
  } else {
    cb(new AppError('Only images, PDFs, and text files are allowed', 400), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } 
});

app.post('/files', upload.single('file'), (req, res, next) => {
  try {
    if (!req.file) {
      throw new AppError('No file uploaded', 400);
    }
    res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: `${(req.file.size / 1024).toFixed(2)} KB`,
        mimetype: req.file.mimetype,
        uploadedAt: new Date().toISOString()
      }
    });
  } catch (err) {
    next(err);
  }
});
app.get('/files', (req, res, next) => {
  try {
    const uploadsDir = path.join(__dirname, 'uploads');
    const files = fs.readdirSync(uploadsDir);

    if (files.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No files uploaded yet',
        data: []
      });
    }

    const fileList = files.map(filename => {
      const filePath = path.join(uploadsDir, filename);
      const stats = fs.statSync(filePath);
      return {
        filename,
        size: `${(stats.size / 1024).toFixed(2)} KB`,
        uploadedAt: stats.birthtime
      };
    });

    res.status(200).json({
      success: true,
      message: 'Files fetched successfully',
      count: fileList.length,
      data: fileList
    });
  } catch (err) {
    next(err);
  }
});

app.get('/files/:filename', (req, res, next) => {
  try {
    const filePath = path.join(__dirname, 'uploads', req.params.filename);

    if (!fs.existsSync(filePath)) {
      throw new AppError('File not found', 404);
    }
    const readStream = fs.createReadStream(filePath);

    readStream.on('error', () => {
      next(new AppError('Error reading file', 500));
    });
    res.setHeader('Content-Disposition', `attachment; filename="${req.params.filename}"`);
    readStream.pipe(res);
  } catch (err) {
    next(err);
  }
});

app.delete('/files/:filename', (req, res, next) => {
  try {
    const filePath = path.join(__dirname, 'uploads', req.params.filename);

    if (!fs.existsSync(filePath)) {
      throw new AppError('File not found', 404);
    }

    fs.unlinkSync(filePath); 

    res.status(200).json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (err) {
    next(err);
  }
});

app.use((req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
