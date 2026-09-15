import { type Request, type Response, Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { rateLimiter } from '../middleware/rateLimiter';
import { projectRepo } from '../repositories/project.repository';
import { auditLogRepo } from '../repositories/audit_log.repository';
import { createProjectSchema, updateProjectSchema } from '../schemas/project.schema';
import { requireRole } from '../middleware/rbac';


const router = Router();

//all routes require authentication
router.use(authMiddleware);
router.use(rateLimiter.defaultLimiter);

//GET /api/projects - list all (Viewer and above)
router.get('/', async (req: Request, res: Response) => {
    if (!req.user?.tenantId) {
        return res.status(400).json({ error: "Missing tenant" })
    }
    const projects = await projectRepo.listProjects(req.user?.tenantId)

    auditLogRepo.createAuditLog({
        tenantId: req.user.tenantId,
        userId: req.user.userId,
        userEmail: req.user.email,
        userRole: req.user.role,
        action: 'VIEW',
        resource: 'projects',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        oldValues: {},
        newValues: {}
    })

    return res.json({ projects })

});

//GET /api/projects/:id - single project(Viewer and above)
router.get('/:id', async (req: Request<{ id: string }>, res: Response) => {
    if (!req.user?.tenantId) {
        return res.status(400).json({ error: "Missing tenant" })
    }
    const project = await projectRepo.getProject(req.params.id, req.user?.tenantId)
    return res.json(project)

})

//POST /api/projects - post a project
router.post('/', async (req: Request, res: Response) => {
    if (!req.user?.tenantId || !req.user?.userId) {
        return res.status(400).json({ error: 'Missing tenantID or userID' })
    }

    const data = createProjectSchema.parse(req.body);
    const project = await projectRepo.createProject({
        tenantId: req.user?.tenantId,
        createdBy: req.user?.userId,
        name: data.name,
        description: data.description
    })

    auditLogRepo.createAuditLog({
        tenantId: req.user.tenantId,
        userId: req.user.userId,
        userEmail: req.user.email,
        userRole: req.user.role,
        action: 'CREATE',
        resource: 'projects',
        resourceId: project.id,
        oldValues: {},
        newValues: project,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']

    })

    return res.status(201).json(project)
});

router.put('/:id', requireRole('Member', 'TenantAdmin', 'SuperAdmin'),
    async (req: Request<{ id: string }>, res: Response) => {
        if (!req.user?.tenantId) {
            return res.status(400).json({ error: "Missing tenant" })
        }
        const oldProject = await projectRepo.getProject(req.params.id, req.user?.tenantId)
        if (!oldProject) {
            return res.status(404).json({ error: 'Not found' })
        }

        const data = updateProjectSchema.parse(req.body);

        const newValues = {
            ...oldProject,
            data
        }

        const updated = await projectRepo.updateProject(req.params.id, req.user.tenantId, newValues);

        auditLogRepo.createAuditLog({
            tenantId: req.user.tenantId,
            userId: req.user.userId,
            userEmail: req.user.email,
            userRole: req.user.role,
            action: 'UPDATE',
            resource: 'projects',
            resourceId: req.params.id,
            oldValues: oldProject,
            newValues: updated,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent']
        })

        res.json(updated)
    })


//DELETE /api/projects/:id - TenantAdmin and above only
router.delete('/:id', requireRole('TenantAdmin'), async (req: Request<{ id: string }>, res: Response) => {
    if (!req.user?.tenantId) {
        return res.status(400).json({ error: "Missing tenant" })
    }
    const project = await projectRepo.getProject(req.params.id, req.user?.tenantId);
    if(!project) return res.status(404).json({error:'Not found'})

    await projectRepo.deleteProject(req.params.id, req.user.tenantId);
    
    auditLogRepo.createAuditLog({
        tenantId: req.user.tenantId,
        userId: req.user.userId,
        userEmail: req.user.email,
        userRole: req.user.role,
        action: 'DELETE',
        resource: 'projects',
        resourceId: req.params.id,
        oldValues: project,
        newValues: {},
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
    })

    res.json({deleted:true})

})    

export default router;
