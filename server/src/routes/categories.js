const express = require('express');
const { z } = require('zod');

const router = express.Router();

router.get('/image', async (req, res) => {
	const categories = await req.prisma.imageCategory.findMany({ include: { images: true } });
	res.json(categories);
});

router.post('/image', async (req, res) => {
	const schema = z.object({ name: z.string().min(2) });
	const parse = schema.safeParse(req.body);
	if (!parse.success) return res.status(400).json({ error: 'Invalid payload' });
	const created = await req.prisma.imageCategory.create({ data: parse.data });
	res.json(created);
});

router.put('/image/:id', async (req, res) => {
	const schema = z.object({ name: z.string().min(2) });
	const parse = schema.safeParse(req.body);
	if (!parse.success) return res.status(400).json({ error: 'Invalid payload' });
	const updated = await req.prisma.imageCategory.update({ where: { id: req.params.id }, data: parse.data });
	res.json(updated);
});

module.exports = router;