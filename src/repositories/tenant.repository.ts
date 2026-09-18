import { Prisma } from "../../generated/prisma/client";
import prisma from "../../lib/prisma";

async function createTenant(data: Prisma.TenantCreateInput) {
    const tenant = await prisma.tenant.create({ data })
    return tenant;
}

async function getTenant(id: string) {
    const tenant = await prisma.tenant.findFirst({ where: { id } })
    return tenant;
}


export const tenantRepo = {
    createTenant,
    getTenant
}