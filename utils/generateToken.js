import jwt from 'jsonwebtoken';

export const generateToken = (studentId) => {
  return jwt.sign({ id: studentId }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};