import { type Request, type Response, Router } from "express";
import { createTenantAdminInput, createTenantAdminSchema } from "../schemas/tenant.schema";
import prisma from "../../lib/prisma";
import * as bcrypt from 'bcryptjs'
import { UserRole } from "../../generated/prisma/enums";
import { generateToken } from "../utils/token";
import { requireRole } from "../middleware/rbac";
import { tenantRepo } from "../repositories/tenant.repository";
import { authMiddleware } from "../middleware/auth";


const router = Router();

router.post('/', async(req:Request<{},undefined,createTenantAdminInput,{}>,res:Response) => {

    const data = createTenantAdminSchema.parse(req.body)

    //check if user can be created
    const existingUser = await prisma.user.findFirst({where: {email:data.email}})
    if(existingUser){
        return res.status(409).json({error:"User exists"})
    }


    //create tenant
    const tenant = await prisma.tenant.create({data:{
        name: data.tenant_name
    }});

    //hash password
    const salt  = await bcrypt.genSalt(10);
    const hashed_password = await bcrypt.hash(data.password,salt)

    //create user with TenantAdmin role attaching tenant
    const user = await prisma.user.create({data:{
        email: data.email,
        password: hashed_password,
        tenantId: tenant.id,
        role: UserRole.TENANTADMIN, 
    }})

    const token = generateToken({userId:user.id,tenantId:user.tenantId,email:user.email,role:user.role });

    return res.status(201).json({
        token,
        user,
    })
});

router.get('/',authMiddleware, requireRole('SUPERADMIN'), async(req:Request,res:Response) => {
    const tenants = await prisma.tenant.findMany()

    return res.json({
        data:tenants
    })
})


export default router;