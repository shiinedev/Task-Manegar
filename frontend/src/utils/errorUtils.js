export const errorExtract = (err) =>{
    if(!err){
        return null
    }

    if(err.response?.data){
        const data = err.response?.data;

        //zod validation errors
        if(data.errors && Array.isArray(data.errors)){
            return data?.errors?.map(err => err?.message).join(",");
        }

          // handle single error message

        if(data?.message){
            return data.message
        }

        // handle error field

        if(data?.error){
            return data.field
        }

    }

        // handle network errors


    if (err.response && !err.response.data) {
        return 'Network Error , Please check your connection'
    }

    // Fall back to general error

    if (err.message) {
        return err.message
    }
    // Handle other types of errors

    return 'Something went wrong. please try again'
}