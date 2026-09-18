import bcrypt from "bcryptjs";
import prisma from "../lib/prisma";
import { UserRole } from "../generated/prisma/enums";
async function main(){
    const passwordHash = await  bcrypt.hash('Admin@123',10);

    await prisma.user.upsert({
        where: {email: 'admin@example.com'},
        update:{},
        create:{
            email: 'admin@example.com',
            password: passwordHash,
            role: UserRole.SUPERADMIN,
        }
    })
}
main()
.catch(console.error)    
.finally(async () => {
    await prisma.$disconnect()
})