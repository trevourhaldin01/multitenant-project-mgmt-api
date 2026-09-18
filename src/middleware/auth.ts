import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                tenantId: string;
                email: string;
                role: string;
            };
        }
    }
}

export const authMiddleware = (req:Request,res:Response,next:NextFunction) => {
    //get auth header
    const authHeader = req.headers.authorization;
    if(!authHeader?.startsWith('Bearer ')){
        return res.status(401).json({error: "Missing or malformed Authorization header"})
    }

    //get token from auth header
    const token = authHeader.split(' ')[1]

    //verify token and retrieve details (userId, tenantId, email, role)
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret')

        if (typeof decoded === 'string') {
            return res.status(401).json({ error: 'Invalid token' })
        }

        //tenantId always comes from verified token
        req.user = {
            userId: decoded.userId,
            tenantId: decoded.tenantId,
            email: decoded.email,
            role: decoded.role
        }
        return next()
    } catch (error) {
        console.log(error)
        return res.status(401).json({ error: 'Invalid or expired token' })
    }
}