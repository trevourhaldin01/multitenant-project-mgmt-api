import { type Request,type Response, Router } from "express";
import { requireRole } from "../middleware/rbac";
import { auditLogRepo } from "../repositories/audit_log.repository";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.use(authMiddleware)

router.get('/', requireRole("SUPERADMIN"), async (req:Request, res:Response) => {
    const logs = await auditLogRepo.getAuditLogs()

    return res.json({
        data:logs
    })
})

export default router;