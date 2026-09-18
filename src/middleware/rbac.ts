import type { NextFunction, Request, Response } from "express"

const ROLE_HIERACHY = {
    SUPERADMIN: 4,
    TENANTADMIN: 3,
    MEMBER: 2,
    VIEWER: 1,
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