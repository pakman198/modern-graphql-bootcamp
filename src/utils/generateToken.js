require('dotenv').config({ path: '.env'})
import jwt from 'jsonwebtoken';

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.SECRET, { expiresIn: "7d" });
};

export default generateToken;