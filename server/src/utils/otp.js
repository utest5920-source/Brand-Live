const crypto = require('crypto');

function generateSixDigitOtp() {
	const randomNumber = crypto.randomInt(0, 1000000);
	return String(randomNumber).padStart(6, '0');
}

function minutesFromNow(minutes) {
	const now = new Date();
	now.setMinutes(now.getMinutes() + minutes);
	return now;
}

module.exports = { generateSixDigitOtp, minutesFromNow };