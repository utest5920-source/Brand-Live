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

router.post('/frame', upload.single('image'), async (req, res) => {
	const schema = z.object({ name: z.string() });
	const parse = schema.safeParse(req.body);
	if (!parse.success) return res.status(400).json({ error: 'Invalid payload' });
	const imageUrl = `/uploads/${req.file.filename}`;
	const created = await req.prisma.politicalFrame.create({ data: { name: parse.data.name, imageUrl } });
	res.json(created);
});

router.put('/frame/:id', upload.single('image'), async (req, res) => {
	const schema = z.object({ name: z.string().optional() });
	const parse = schema.safeParse(req.body);
	if (!parse.success) return res.status(400).json({ error: 'Invalid payload' });
	const data = { ...parse.data };
	if (req.file) data.imageUrl = `/uploads/${req.file.filename}`;
	const updated = await req.prisma.politicalFrame.update({ where: { id: req.params.id }, data });
	res.json(updated);
});

router.get('/frames', async (req, res) => {
	const frames = await req.prisma.politicalFrame.findMany();
	res.json(frames);
});

router.get('/profile', async (req, res) => {
	const profile = await req.prisma.politicalProfile.findUnique({ where: { userId: req.user.userId }, include: { frame: true } });
	res.json(profile);
});

router.post('/profile', async (req, res) => {
	const schema = z.object({
		designation: z.string().optional(),
		party: z.string().optional(),
		number: z.string().optional(),
		email: z.string().optional(),
		website: z.string().optional(),
		address: z.string().optional(),
		frameId: z.string().optional(),
	});
	const parse = schema.safeParse(req.body);
	if (!parse.success) return res.status(400).json({ error: 'Invalid payload' });
	const data = { ...parse.data, userId: req.user.userId };
	const existing = await req.prisma.politicalProfile.findUnique({ where: { userId: req.user.userId } });
	let profile;
	if (existing) {
		profile = await req.prisma.politicalProfile.update({ where: { userId: req.user.userId }, data });
	} else {
		profile = await req.prisma.politicalProfile.create({ data });
	}
	res.json(profile);
});

module.exports = router;