import User from "../models/auth.js";
import { generateToken } from "../utils/generateToken.js";

// register new user

export const register = async (req, res, next) => {
  let { name, email, password, phone,role,profile } = req.body;

  try {
    email = email.toLowerCase();
    const exist = await User.findOne({ email });

    if (exist) return res.status(400).send({message:"email already exists"});

    const student = await User.create({ name, email, password, phone,role,profile });
    const token = generateToken(student._id);

    res.status(201).json({ token });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  let { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password)))
      return res
        .status(401)
        .json({ message: "email or password is not correct" });

        const token =  generateToken(user._id);
        user.password = undefined


        res.json({token,user})
  } catch (error) {
    
    next(error);
    
  }
};
