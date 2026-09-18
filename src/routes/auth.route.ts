import { type Request, type Response, Router } from "express";
import { createTenantMemberInput, createTenantMemberSchema } from "../schemas/tenant.schema";
import { requireRole } from "../middleware/rbac";
import prisma from "../../lib/prisma";
import * as bcrypt from 'bcryptjs'
import { generateToken } from "../utils/token";
import { UserRole } from "../../generated/prisma/enums";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.post('/signup',authMiddleware, requireRole("TENANTADMIN"), async (req: Request<{}, undefined, createTenantMemberInput, {}>, res: Response) => {
    const data = createTenantMemberSchema.parse(req.body);

    //check if user can be created
    const existingUser = await prisma.user.findFirst({ where: { email: data.email } })
    if (existingUser) {
        return res.status(409).json({ error: "User exists" })
    }

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashed_password = await bcrypt.hash(data.password, salt)

    //create user with TenantAdmin role attaching tenant
    const user = await prisma.user.create({
        data: {
            email: data.email,
            password: hashed_password,
            tenantId: data.tenantId,
        }
    })

    const token = generateToken({ userId: user.id, tenantId: user.tenantId, email: user.email, role: user.role });
    
    const {password, ...userWithoutPassword} = user

    return res.status(201).json({
        token,
        user: userWithoutPassword,
    })



})

router.post('/login', async (req: Request<{}, undefined, { email: string,password:string }, {}>, res: Response) => {
    const {email,password} = req.body;

    //check it user exists
    const existing  = await prisma.user.findFirst({where:{email}})
    if(!existing){
        return res.status(404).json({error:"user not found"})
    }

    //compare passwords
    const isPasswordValid = await bcrypt.compare(password,existing.password);
    if(!isPasswordValid){
        return res.status(401).json({error:"Unauthorized"})
    }

    const token = generateToken({
        userId:existing.id,
        tenantId: existing.tenantId,
        email: existing.email,
        role: existing.role as UserRole
    })
    const {password:userPassword, ...userWithouPassword} = existing;
    console.log('...')

    return res.status(200).json({
        success:true,
        message:"User logged in Successfully",
        data: {
            token,
            user: userWithouPassword
        }
    })



})

export default router