
export const errorHandler = (err, req, res, next) =>{

    const status = err.statuscode || 500;
    res.json(
        {
            success:false,
            message:err.message || "something went wrong",
            status
        }
    )

}