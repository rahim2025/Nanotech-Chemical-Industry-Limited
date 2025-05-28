import jwt from "jsonwebtoken"

export const genToken = (userId,res) =>{
    const token = jwt.sign({userId},process.env.secret,{
        expiresIn:"7d"
    });

    // Get environment to determine proper cookie settings
    const isProduction = process.env.NODE_ENV === 'production';
    
    res.cookie("jwt",token,{
        maxAge: 7*24*60*60*1000,
        httpOnly: true,
        // For cross-domain cookies in production
        domain: isProduction ? '.nanotechchemical.com' : undefined, // dot prefix allows sharing between subdomains
        sameSite: isProduction ? 'none' : 'lax', // 'none' allows cross-site cookies
        secure: isProduction, // secure must be true when sameSite is 'none'
    });
    return token;
}