require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const multer = require('multer');

const { PrismaClient } = require('@prisma/client');

const { authMiddleware } = require('./middleware/auth');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const businessRoutes = require('./routes/business');
const politicalRoutes = require('./routes/political');
const categoriesRoutes = require('./routes/categories');
const imagesRoutes = require('./routes/images');
const adsRoutes = require('./routes/ads');

const prisma = new PrismaClient();
const app = express();

const corsOrigin = process.env.CORS_ORIGIN || '*';
app.use(cors({ origin: corsOrigin, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(path.resolve(process.env.UPLOAD_DIR || './uploads')));

// Attach Prisma to request for route handlers
app.use((req, _res, next) => {
	req.prisma = prisma;
	next();
});

app.get('/health', (_req, res) => {
	res.json({ status: 'ok' });
});

app.use('/auth', authRoutes);
app.use('/me', authMiddleware, userRoutes);
app.use('/business', authMiddleware, businessRoutes);
app.use('/political', authMiddleware, politicalRoutes);
app.use('/categories', authMiddleware, categoriesRoutes);
app.use('/images', authMiddleware, imagesRoutes);
app.use('/ads', authMiddleware, adsRoutes);

const port = Number(process.env.PORT || 4000);
app.listen(port, () => {
	console.log(`Server listening on http://localhost:${port}`);
});