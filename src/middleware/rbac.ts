import type { NextFunction, Request, Response } from "express"
import { error } from "node:console";

const ROLE_HIERACHY = {
    SuperAdmin: 4,
    TenantAdmin: 3,
    Member: 2,
    Viewer: 1,
}

//requireRole('TenantAdmin') - user must be TenantAdmin or higher to access the route
export function requireRole(...roles: Array<keyof typeof ROLE_HIERACHY>){
    return (req:Request, res:Response, next:NextFunction) => {
        const userRole = req.user?.role as keyof typeof ROLE_HIERACHY | undefined;
        const userLevel = userRole ? ROLE_HIERACHY[userRole] : 0;
        const requiredLevel = Math.min(...roles.map(r => ROLE_HIERACHY[r] ?? 999))

        if(userLevel < requiredLevel) {
            return res.status(403).json({
                error: "Insufficient Permissions",
                required: roles,
                current: req.user?.role
            })
        }

        next();
    }
}