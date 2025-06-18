import User from '../models/auth.js';
import jwt from "jsonwebtoken"

export const protect = async (req,res,next) =>{
    
    const token = req.headers.authorization?.split(" ")[1];
    try {
        if(!token) return res.status(401).json({message:"no token resolved"});
        const decode = jwt.verify(token,process.env.JWT_SECRET);
        console.log(decode);
        req.user = await User.findById(decode.id).select("-password")
        next()
    } catch (error) {
        res.status(401).json({message:error.message});
    }
}