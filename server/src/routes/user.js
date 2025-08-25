const express = require('express');
const { z } = require('zod');

const router = express.Router();

router.get('/profile', async (req, res) => {
	const prisma = req.prisma;
	const userId = req.user.userId;
	const user = await prisma.user.findUnique({ where: { id: userId } });
	if (!user) return res.status(404).json({ error: 'User not found' });
	return res.json(user);
});

const updateSchema = z.object({
	name: z.string().optional(),
	profilePictureUrl: z.string().optional(),
	designation: z.string().optional(),
	birthdate: z.string().optional(),
	gender: z.string().optional(),
	email: z.string().email().optional(),
	city: z.string().optional(),
	subscription: z.string().optional(),
	subscriptionPlanDetails: z.string().optional(),
	role: z.enum(['ADMIN','USER','BUSINESS','POLITICIAN']).optional(),
});

router.put('/profile', async (req, res) => {
	const prisma = req.prisma;
	const userId = req.user.userId;
	const parse = updateSchema.safeParse(req.body);
	if (!parse.success) return res.status(400).json({ error: 'Invalid payload', details: parse.error.flatten() });
	const data = parse.data;
	if (data.birthdate) data.birthdate = new Date(data.birthdate);
	const updated = await prisma.user.update({ where: { id: userId }, data });
	return res.json(updated);
});

module.exports = router;