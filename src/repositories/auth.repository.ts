import { Prisma } from "../../generated/prisma/client";
import prisma from "../../lib/prisma";

async function createUser(data: Prisma.UserCreateInput){
    const user = await prisma.user.create({data})
    return user;
}

export const authRepo = {
    createUser
}