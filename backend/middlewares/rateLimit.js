import rateLimit from "express-rate-limit"


export const limiter =  rateLimit({
    windowMs:15 * 60 * 100,
    max:50,
    message:"too many request please try again"
})