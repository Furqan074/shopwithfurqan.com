import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const isAdmin = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.status(403).json({
        success: false,
        message: "unauthorized request",
      });
    }

    const token = req.headers.authorization.split(" ")[1];

    const decodedToken = jwt.verify(token, JWT_SECRET);

    const { adminEmail, adminPassword } = decodedToken;

    if (adminEmail !== ADMIN_EMAIL && adminPassword !== ADMIN_PASSWORD) {
      return res.status(403).json({
        success: false,
        message: "unauthorized request",
      });
    }

    next();
  } catch (error) {
    if (error.message === "invalid token") {
      console.error("unauthorized or specious request: ", error);
      return res.status(403).json({
        success: false,
        message: "unauthorized request",
      });
    }
  }
};

export default isAdmin;
