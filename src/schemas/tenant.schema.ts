import z from "zod"

export const createTenantAdminSchema = z.object({
    email: z.email({error:"Please enter a valid email address"}),
    tenant_name: z.string({error: "tenant name is required"}),
    password: z.string()
        .trim()
        .min(8,{error:"Password must be atleast 8 characters long"})
        .max(50,{error:"Password cannot exceed 50 characters"})
        .regex(/[A-Z]/,{error:"Password must contain atleast one uppercase letter"})
        .regex(/[a-z]/,{error:"Password must contain atleast one lowercase letter"})
        .regex(/[0-9]/,{error:"Password must contain atleast one number"})
        .regex(/[^A-Za-z0-9]/, {error:"Password must contain atleast one special character"}),
    confirm_password: z.string()
})
.superRefine(({password,confirm_password},ctx)=>{
    if(confirm_password !== password){
        ctx.addIssue({
            code: 'custom',
            message: "Passwords do not match",
            path: ['confirmPassword']
        })
    }

})

export const createTenantMemberSchema = z.object({
    email: z.email({error:"Please enter a valid email address"}),
    tenantId: z.string({error: "tenant is required"}),
    password: z.string()
        .trim()
        .min(8,{error:"Password must be atleast 8 characters long"})
        .max(50,{error:"Password cannot exceed 50 characters"})
        .regex(/[A-Z]/,{error:"Password must contain atleast one uppercase letter"})
        .regex(/[a-z]/,{error:"Password must contain atleast one lowercase letter"})
        .regex(/[0-9]/,{error:"Password must contain atleast one number"})
        .regex(/[^A-Za-z0-9]/, {error:"Password must contain atleast one special character"}),
    confirm_password: z.string()
})
.superRefine(({password,confirm_password},ctx)=>{
    if(confirm_password !== password){
        ctx.addIssue({
            code: 'custom',
            message: "Passwords do not match",
            path: ['confirmPassword']
        })
    }

})

export type createTenantMemberInput = z.infer<typeof createTenantMemberSchema>

export type createTenantAdminInput = z.infer<typeof createTenantAdminSchema>