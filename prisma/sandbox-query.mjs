import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const allUsers = await prisma.user.findMany()
    console.log(allUsers)
    const allPosts = await prisma.post.findMany()
    console.log(allPosts)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })