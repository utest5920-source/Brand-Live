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

router.get('/categories', async (req, res) => {
	const categories = await req.prisma.businessCategory.findMany();
	res.json(categories);
});

router.post('/categories', async (req, res) => {
	const schema = z.object({ name: z.string().min(2) });
	const parse = schema.safeParse(req.body);
	if (!parse.success) return res.status(400).json({ error: 'Invalid payload' });
	const created = await req.prisma.businessCategory.create({ data: parse.data });
	res.json(created);
});

router.put('/categories/:id', async (req, res) => {
	const schema = z.object({ name: z.string().min(2) });
	const parse = schema.safeParse(req.body);
	if (!parse.success) return res.status(400).json({ error: 'Invalid payload' });
	const updated = await req.prisma.businessCategory.update({ where: { id: req.params.id }, data: parse.data });
	res.json(updated);
});

router.post('/frame', upload.single('image'), async (req, res) => {
	const schema = z.object({ name: z.string(), categoryId: z.string().optional() });
	const parse = schema.safeParse(req.body);
	if (!parse.success) return res.status(400).json({ error: 'Invalid payload' });
	const imageUrl = `/uploads/${req.file.filename}`;
	const created = await req.prisma.businessFrame.create({ data: { name: parse.data.name, categoryId: parse.data.categoryId || null, imageUrl } });
	res.json(created);
});

router.put('/frame/:id', upload.single('image'), async (req, res) => {
	const schema = z.object({ name: z.string().optional(), categoryId: z.string().optional() });
	const parse = schema.safeParse(req.body);
	if (!parse.success) return res.status(400).json({ error: 'Invalid payload' });
	const data = { ...parse.data };
	if (req.file) data.imageUrl = `/uploads/${req.file.filename}`;
	const updated = await req.prisma.businessFrame.update({ where: { id: req.params.id }, data });
	res.json(updated);
});

router.get('/frames', async (req, res) => {
	const frames = await req.prisma.businessFrame.findMany({ include: { category: true } });
	res.json(frames);
});

router.get('/profile', async (req, res) => {
	const profile = await req.prisma.businessProfile.findUnique({ where: { userId: req.user.userId }, include: { category: true, frame: true } });
	res.json(profile);
});

router.post('/profile', async (req, res) => {
	const schema = z.object({
		categoryId: z.string().optional(),
		name: z.string().optional(),
		logoUrl: z.string().optional(),
		email: z.string().optional(),
		address: z.string().optional(),
		phone1: z.string().optional(),
		phone2: z.string().optional(),
		website: z.string().optional(),
		frameId: z.string().optional(),
	});
	const parse = schema.safeParse(req.body);
	if (!parse.success) return res.status(400).json({ error: 'Invalid payload' });
	const data = { ...parse.data, userId: req.user.userId };
	const existing = await req.prisma.businessProfile.findUnique({ where: { userId: req.user.userId } });
	let profile;
	if (existing) {
		profile = await req.prisma.businessProfile.update({ where: { userId: req.user.userId }, data });
	} else {
		profile = await req.prisma.businessProfile.create({ data });
	}
	res.json(profile);
});

module.exports = router;