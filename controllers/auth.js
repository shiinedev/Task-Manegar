import Student from "../models/Student.js";
import { generateToken } from "../utils/generateToken.js";

// register new user

export const register = async (req, res, next) => {
  let { name, email, password, phone,role,profile } = req.body;

  try {
    email = email.toLowerCase();
    const exist = await Student.findOne({ email });

    if (exist) return res.status(400).send("email already exists");

    const student = await Student.create({ name, email, password, phone,role,profile });
    const token = generateToken(student._id);

    res.status(201).json({ token });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  let { email, password } = req.body;
  try {
    const student = await Student.findOne({ email });

    if (!student || !(await student.comparePassword(password)))
      return res
        .status(501)
        .json({ message: "email or password is not correct" });

        const token =  generateToken(student._id);

        res.json({token})
  } catch (error) {
    next(error);
  }
};
