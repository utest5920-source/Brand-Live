const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
	const businessCategories = ['Retail', 'Food & Beverage', 'Health & Wellness', 'Technology']
	for (const name of businessCategories) {
		await prisma.businessCategory.upsert({
			where: { name },
			update: {},
			create: { name },
		})
	}

	const imageCategories = ['Festivals', 'Offers', 'Events']
	for (const name of imageCategories) {
		await prisma.imageCategory.upsert({
			where: { name },
			update: {},
			create: { name },
		})
	}

	console.log('Seed completed')
}

main().catch((e) => {
	console.error(e)
	process.exit(1)
}).finally(async () => {
	await prisma.$disconnect()
})