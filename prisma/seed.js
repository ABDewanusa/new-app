const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const bcrypt = require('bcrypt');
const { use } = require('react');

async function main() {
    const passGandalf = await bcrypt.hash("YouShallNotPass!", 5);
    const admin = await prisma.role.upsert({
        where: { id: 1 },
        update: {},
        create: {
            role: "ADMIN",
            users: {
                create: [
                    {
                        name: "Gandalf",
                        password: passGandalf
                    },
                ]
            }
        }
    })

    const passFrodo = await bcrypt.hash("IWillTakeIt!", 5);
    const superuser = await prisma.role.upsert({
        where: { id: 2 },
        update: {},
        create: {
            role: "SUPERUSER",
            users: {
                create: [
                    {
                        name: "Frodo",
                        password: passFrodo
                    },
                ]
            }
        }
    })

    const passAragorn = await bcrypt.hash("YouHaveMySword!", 5);
    const passLegolas = await bcrypt.hash("AndYouHaveMyBow!", 5);
    const passGimli = await bcrypt.hash("AndMyAxe!", 5);
    const user = await prisma.role.upsert({
        where: { id: 3 },
        update: {},
        create: {
            role: "USER",
            users: {
                create: [
                    {
                        name: "Aragorn",
                        password: passAragorn
                    },
                    {
                        name: "Legolas",
                        password: passLegolas
                    },
                    {
                        name: "Gimli",
                        password: passGimli
                    },
                ]
            }
        }
    })

    const product = await prisma.product.createMany({
        data: [
            {
                name: "RotiBurger-Medium-Isi6 ",
                type: "Roti-Burger",
                gramPerUnit: 50,
                unitPerPack: 6
            },
            {
                name: "RotiBurger-Medium-Isi4 ",
                type: "Roti-Burger",
                gramPerUnit: 50,
                unitPerPack: 4
            },
            {
                name: "RotiBurger-Mini-Isi11 ",
                type: "Roti-Burger",
                gramPerUnit: 35,
                unitPerPack: 11
            },
            {
                name: "RotiBurger-Jumbo-Satuan ",
                type: "Roti-Burger",
                gramPerUnit: 80,
                unitPerPack: 1
            }
        ],
        skipDuplicates: true,
    })

    const customer = await prisma.customer.upsert({
        where: { id: "CUSTOMER_404" },
        update: {},
        create: {
            id: "CUSTOMER_404",
            name: "unrecorder-customer"
        }
    })

    console.log({ admin, superuser, user, product, customer })
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