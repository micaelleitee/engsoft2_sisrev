"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    // cria dois labs
    await prisma.lab.upsert({
        where: { id: 1 },
        update: {},
        create: { name: "Lab 01 - Informática", capacity: 30 },
    });
    await prisma.lab.upsert({
        where: { id: 2 },
        update: {},
        create: { name: "Lab 02 - Redes", capacity: 20 },
    });
    // cria admin com senha hashed
    const email = "admin@ifce.edu.br";
    const password = await bcryptjs_1.default.hash("admin123", 10);
    await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
            name: "Admin IFCE",
            email,
            password,
            role: "admin",
        },
    });
    console.log("Seed executado");
}
main()
    .catch(console.error)
    .finally(async () => {
    await prisma.$disconnect();
});
