import 'dotenv/config';
import express from 'express';
import type { Express, Response, Request, NextFunction } from 'express';
import cors from 'cors';
import projectRouter from './routes/projects.route';
import tenantRouter from './routes/tenants.route';
import authRouter from './routes/auth.route';
import auditLogRouter from './routes/audit_log.route';
import z from 'zod';

const app: Express = express();

app.use(cors());
app.use(express.json());

//routes here
app.use('/api/auth', authRouter)
app.use('/api/projects',projectRouter)
app.use('/api/tenants',tenantRouter)
app.use('/api/audit_logs', auditLogRouter)


app.use((err:Error,req:Request,res:Response,next:NextFunction)=>{
    if(err instanceof z.ZodError){
        return res.status(400).json({
            status: "fail",
            message: "validation failed",
            errors: z.treeifyError(err)
        })
    }
    console.error(err.stack)
    res.status(500).json({error: 'Internal Server Error'})
})

export default app;
