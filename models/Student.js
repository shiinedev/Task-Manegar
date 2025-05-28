
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';


const studentSchema = new mongoose.Schema({
    name:String,
    email: {type:String, unique:true},
    phone:Number,
    password:String,
    role:{
      type:String,
      enum:['admin',"user"],
      default:"user"
    },
    profile:String
    
})

studentSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

studentSchema.methods.comparePassword = function (inputPassword) {
  return bcrypt.compare(inputPassword, this.password);
};



const User = mongoose.model('Student',studentSchema);

export default User
