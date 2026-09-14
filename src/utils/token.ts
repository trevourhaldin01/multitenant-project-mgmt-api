import * as jwt from 'jsonwebtoken'

export const generateToken =({userId, tenantId, email, role}: {
    userId: string, tenantId: string, email: string, role: string}) =>{
        return jwt.sign({userId,tenantId,email,role},
            process.env.JWT_SECRET || 'secret',{expiresIn: '24h'}
        );
}

