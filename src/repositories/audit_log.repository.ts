import { Prisma } from "../../generated/prisma/client";
import prisma from "../../lib/prisma";

async function createAuditLog(data: Prisma.AuditLogCreateInput){
    const result = await prisma.auditLog.create({data})
    return result;
}

export const auditLogRepo = {
    createAuditLog,
}