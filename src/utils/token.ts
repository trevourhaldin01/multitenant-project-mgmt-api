import jwt from 'jsonwebtoken'
import { UserRole } from '../../generated/prisma/enums';

const {sign} = jwt

export const generateToken =({userId, tenantId, email, role}: {
    userId: string, tenantId?: string | null, email: string, role: UserRole}) =>{
        return sign({userId,tenantId,email,role},
            process.env.JWT_SECRET || 'secret',{expiresIn: '24h'}
        );
}

