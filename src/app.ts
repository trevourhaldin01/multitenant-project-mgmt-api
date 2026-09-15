import 'dotenv/config';
import express from 'express';
import type { Express, Response, Request, NextFunction } from 'express';
import cors from 'cors';
import projectRouter from './routes/projects.route';

const app: Express = express();

app.use(cors());
app.use(express.json());

//routes here
app.use('/api/projects',projectRouter)

app.use((err:Error,req:Request,res:Response,next:NextFunction)=>{
    console.error(err.stack)
    res.status(500).json({error: 'Internal Server Error'})
})

export default app;
