import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;

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

    if (
      decodedToken.adminEmail === process.env.admin_Email &&
      decodedToken.adminPassword === process.env.admin_Password
    ) {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: "unauthorized request",
      });
    }
  } catch (error) {
    if (error.message === "invalid token") {
      console.error("unauthorized or specious request made " + error);
      return res.status(403).json({
        success: false,
        message: "unauthorized request",
      });
    }
  }
};

export default isAdmin;
