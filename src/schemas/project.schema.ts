import {z} from 'zod';

export const createProjectSchema = z.object({
    tenantId: z.string(),
    name: z.string(),
    createdBy: z.string(),
    description: z.string().optional()
});

export const updateProjectSchema = z.object({
    name: z.string(),
    description: z.string().optional()
})


export type createProjectDto = z.infer<typeof createProjectSchema>;
export type updateProjectDto = z.infer<typeof updateProjectSchema>;