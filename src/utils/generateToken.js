import jwt from "jsonwebtoken";

const generateToken = async ({ userId, role }) => {
  const SECRETKEY = process.env.JWT_SECRET_KEY;

  if (SECRETKEY) {
    const token = jwt.sign({ userId, role }, SECRETKEY, {
      expiresIn: "30d",
    });
    return token;
  }

  throw new Error("JWT key is not defined!");
};

export default generateToken;
