import jwt from "jsonwebtoken";

const protect = async (req, res, next) => {
  const token = req.headers.authorization;
  console.log(token);
  
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decodeed =>", decoded);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default protect;
