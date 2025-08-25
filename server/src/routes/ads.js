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
	const ads = await req.prisma.advertisement.findMany({ orderBy: { createdAt: 'desc' } });
	res.json(ads);
});

router.post('/', upload.single('media'), async (req, res) => {
	const schema = z.object({
		title: z.string(),
		type: z.enum(['POPUP_IMAGE','POPUP_VIDEO','STORY']),
		startsAt: z.string().optional(),
		endsAt: z.string().optional(),
		isActive: z.coerce.boolean().optional()
	});
	const parse = schema.safeParse(req.body);
	if (!parse.success) return res.status(400).json({ error: 'Invalid payload' });
	const mediaUrl = `/uploads/${req.file.filename}`;
	const data = { ...parse.data, mediaUrl };
	if (data.startsAt) data.startsAt = new Date(data.startsAt);
	if (data.endsAt) data.endsAt = new Date(data.endsAt);
	const created = await req.prisma.advertisement.create({ data });
	res.json(created);
});

router.put('/:id', upload.single('media'), async (req, res) => {
	const schema = z.object({
		title: z.string().optional(),
		type: z.enum(['POPUP_IMAGE','POPUP_VIDEO','STORY']).optional(),
		startsAt: z.string().optional(),
		endsAt: z.string().optional(),
		isActive: z.coerce.boolean().optional()
	});
	const parse = schema.safeParse(req.body);
	if (!parse.success) return res.status(400).json({ error: 'Invalid payload' });
	const data = { ...parse.data };
	if (data.startsAt) data.startsAt = new Date(data.startsAt);
	if (data.endsAt) data.endsAt = new Date(data.endsAt);
	if (req.file) data.mediaUrl = `/uploads/${req.file.filename}`;
	const updated = await req.prisma.advertisement.update({ where: { id: req.params.id }, data });
	res.json(updated);
});

module.exports = router;