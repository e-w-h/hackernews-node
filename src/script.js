// Import PrismaClient constructor
const { PrismaClient } = require("@prisma/client")

// Instantiate PrismaClient
const prisma = new PrismaClient()

// Define asyn function called main to send queries to the db
async function main() {
    // Prisma Client queries here
    const newLink = await prisma.link.create({
        data: {
            description: 'Fullstack tutorial for GraphQL',
            url: 'www.howtographql.com',
        },
    })
    const allLinks = await prisma.link.findMany()
    console.log(allLinks)
}

main()
    .catch(e => {
        throw e
    })
    .finally(async () => {
        // Close db connection when script terminates
        await prisma.$disconnect()
    })