import jwt from "jsonwebtoken"

export const genToken = (userId,res) =>{
    const token = jwt.sign({userId},process.env.secret,{
        expiresIn:"7d"
    });

    // Set proper cookie settings based on environment and request origin
    const origin = res.req.headers.origin || '';
    console.log('Request origin:', origin);
    
    // Cookie settings
    const cookieOptions = {
        maxAge: 7*24*60*60*1000,
        httpOnly: true,
        sameSite: 'none', // Allow cross-site cookies
        secure: true, // Required for SameSite=None
    };
    
    // Only set domain for actual domain names, not IP addresses
    if (origin.includes('nanotechchemical.com')) {
        cookieOptions.domain = '.nanotechchemical.com';
    }
      console.log('Setting cookie with options:', cookieOptions);
    res.cookie("jwt", token, cookieOptions);
    return token;
}