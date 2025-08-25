const express = require('express');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const { generateSixDigitOtp, minutesFromNow } = require('../utils/otp');

const router = express.Router();

const loginSchema = z.object({
	phoneNumber: z.string().min(8).max(20),
	referralCode: z.string().optional()
});

router.post('/login', async (req, res) => {
	const parse = loginSchema.safeParse(req.body);
	if (!parse.success) {
		return res.status(400).json({ error: 'Invalid payload', details: parse.error.flatten() });
	}
	const { phoneNumber, referralCode } = parse.data;
	try {
		const prisma = req.prisma;
		const code = generateSixDigitOtp();
		const expiresAt = minutesFromNow(5);
		await prisma.otpRequest.create({ data: { phone: phoneNumber, code, expiresAt } });
		// In production, send via SMS. Here we return it for testing/demo purposes only.
		return res.json({ message: 'OTP sent', demoCode: code });
	} catch (e) {
		return res.status(500).json({ error: 'Failed to create OTP' });
	}
});

const verifySchema = z.object({
	phoneNumber: z.string().min(8).max(20),
	code: z.string().length(6)
});

router.post('/verify', async (req, res) => {
	const parse = verifySchema.safeParse(req.body);
	if (!parse.success) {
		return res.status(400).json({ error: 'Invalid payload', details: parse.error.flatten() });
	}
	const { phoneNumber, code } = parse.data;
	try {
		const prisma = req.prisma;
		const now = new Date();
		const otp = await prisma.otpRequest.findFirst({
			where: { phone: phoneNumber, code, isUsed: false, expiresAt: { gt: now } },
			orderBy: { createdAt: 'desc' }
		});
		if (!otp) {
			return res.status(400).json({ error: 'Invalid or expired OTP' });
		}
		await prisma.otpRequest.update({ where: { id: otp.id }, data: { isUsed: true } });

		let user = await prisma.user.findUnique({ where: { phoneNumber } });
		if (!user) {
			// create new user with default role USER and referralCode
			const referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
			user = await prisma.user.create({ data: { phoneNumber, role: 'USER', referralCode } });
		}
		const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
		return res.json({ token });
	} catch (e) {
		return res.status(500).json({ error: 'Failed to verify OTP' });
	}
});

module.exports = router;