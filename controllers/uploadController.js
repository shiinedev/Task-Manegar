
import cloudinary from "../utils/cloudinary.js";
import Student from '../models/Student.js'


export const uploadFile = (req, res, next) =>{
    if(!req.file) return res.status(400).json({message:"no file uploaded"});


    const stream = cloudinary.uploader.upload_stream(
        {folder:"image-uploads", resource_type:"auto"},
        async(error,result) => {
            if(error) return next(error)  
        await Student.findByIdAndUpdate(req.user._id,{profile:result.secure_url})
        
        res.status(201).json({
            success:true,
            fileUrl:result.secure_url
        })
            
      }
    )

    stream.end(req.file.buffer);
}