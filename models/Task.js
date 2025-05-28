import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title:{type:String, required:true},
    description:String,
    status:{type:String, enum:["pending","in progress","completed"],default:"pending"},
    dueDate:String,
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true,
    }
},{timestamps:true}
)


export default mongoose.model("Task",taskSchema);