import { Prisma } from "../../generated/prisma/client";
import prisma from "../../lib/prisma";

async function createAuditLog(data: Prisma.AuditLogCreateInput){
    const result = await prisma.auditLog.create({data})
    return result;
}

async function getAuditLogs(){
    const logs = await prisma.auditLog.findMany();
    return logs;
}

export const auditLogRepo = {
    createAuditLog,
    getAuditLogs
}