import seedUserData from "./seedUserData.json" with {type: "json"}

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const bcrypt = require('bcrypt');
const { create } = require('domain');
const { use } = require('react');

async function main() {

    const role = await prisma.role.createMany({
        data: [
            { id: 1, role: "ADMIN" },
            { id: 2, role: "SUPERUSER" },
            { id: 3, role: "USERS" },
            { id: 4, role: "DEMO" },
        ],
        skipDuplicates: true,
    })

    const userData = seedUserData.map(async (u) => ({
        name: u.name,
        email: u.email,
        password: await bcrypt.hash(u.password, 5),
        roleId: u.roleId
    }))

    const user = await prisma.user.createMany({
        data: userData,
        skipDuplicates: true,
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

    const customer = await prisma.customer.createMany({
        data: [
            {
                id: "CUSTOMER_404",
                name: "unknown"
            },
            { name: "YuLia-Frozen" },
            { name: "Avan-Frozen" },
            { name: "Huzna-Frozen" },
            { name: "Klan-Frozen" },
            { name: "BurgerEat-BurgerStall" },
            { name: "Levage-BurgerStall" },
            { name: "Y2K-BurgerStall" },

        ],
        skipDuplicates: true,
    })

    const orderStatus = await prisma.orderStatus.createMany({
        data: [
            { id: 1, status: "Queued" },
            { id: 2, status: "Partially-Delivered" },
            { id: 3, status: "Delivered" },
        ],
        skipDuplicates: true,
    })

    console.log({ role, user, product, customer, orderStatus })
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