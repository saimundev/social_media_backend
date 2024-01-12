import jwt from "jsonwebtoken";
const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (authorization) {
    const token = authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
      if (error) return res.status(403).json({ message: "Token is not valid" });
      req.user = user;
      next();
    });
  } else {
    res.status(403).json({ message: "You are not authorize" });
  }
};

export default auth;
