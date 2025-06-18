
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';


const userSchema = new mongoose.Schema({
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

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function (inputPassword) {
  return bcrypt.compare(inputPassword, this.password);
};



const User = mongoose.model('User',userSchema);

export default User
