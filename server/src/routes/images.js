const express = require('express');
const { z } = require('zod');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = process.env.UPLOAD_DIR || './uploads';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
const storage = multer.diskStorage({
	destination: function (_req, _file, cb) {
		cb(null, uploadDir);
	},
	filename: function (_req, file, cb) {
		const ext = path.extname(file.originalname);
		const name = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
		cb(null, name);
	}
});
const upload = multer({ storage });

const router = express.Router();

router.get('/', async (req, res) => {
	const { categoryId } = req.query;
	const where = categoryId ? { categoryId: String(categoryId) } : {};
	const images = await req.prisma.image.findMany({ where, orderBy: { createdAt: 'desc' } });
	res.json(images);
});

router.post('/', upload.single('image'), async (req, res) => {
	const schema = z.object({ categoryId: z.string(), title: z.string().optional() });
	const parse = schema.safeParse(req.body);
	if (!parse.success) return res.status(400).json({ error: 'Invalid payload' });
	const fileUrl = `/uploads/${req.file.filename}`;
	const created = await req.prisma.image.create({ data: { categoryId: parse.data.categoryId, title: parse.data.title || null, fileUrl, createdById: req.user.userId } });
	res.json(created);
});

module.exports = router;