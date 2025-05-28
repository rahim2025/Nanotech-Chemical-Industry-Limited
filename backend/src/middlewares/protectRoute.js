import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
export const protectRoute = async (req,res,next)=>{
    try{
        // Check for token in cookies first
        let token = req.cookies.jwt;
        
        // If no token in cookies, check Authorization header (for API clients)
        if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
            console.log("Using token from Authorization header");
        }
        
        console.log("Auth check - Token exists:", !!token);
        
        if(!token){
            return res.status(401).json({
                message: "Please login first"
            });
        }
        
        const decoded = jwt.verify(token, process.env.secret);
        if(!decoded){
            return res.status(401).json({
                message: "Invalid token, please login"
            });  
        }
        
        const user = await User.findById(decoded.userId).select("-password");
        if(!user){
            return res.status(401).json({
              message: "User not found, Please login"
            });
        }
        
        req.user = user;
        next();
    }catch(error){
        console.error("Error in protect middleware:", error);
        return res.status(500).json({
      message: "Internal server error"
    });
    }
    

}