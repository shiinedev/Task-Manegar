import { z } from "zod";


export  const registerSchema = z.object({
    name: z.string().min(2,"name is required"),
    email: z.string().email("email is not valid"),
    password: z.string()
    .min(6,"password at least be 6 characters")
    .max(30,"the maximum is 30 characters"),
    profile_pic: z.string().optional()
    
})