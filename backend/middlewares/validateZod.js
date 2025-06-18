

export const validateSchema = (schema) => (req ,res, next) =>{

    const result = schema.safeParse(req.body);

    console.log("result:",result);
    
    if(!result.success){

        const formatted = result.error.format();
        

      return  res.status(400).json({
            success:false,
            message:"validation field",
            errors: Object.keys(formatted).map(field => ({
                 field,
                message: formatted[field]?._errors?.[0] || 'Invalid input'
            })
            )
        })

        // return res.status(400).json({
        //     success: false,
        //     message: "Validation failed",
        //     errors: Object.keys(formatted).map(field => ({
        //         field,
        //         message: formatted[field]?._errors?.[0] || 'Invalid input'
        //     }))
        // })
        
    }
    next()
}