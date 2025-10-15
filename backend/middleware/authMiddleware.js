import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import config from '../config/config.js';

const protect = async (req, res, next) => {
  let token;

  // Get token from cookie
  token = req.cookies.jwt;

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
    return; // Stop execution if no token
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret);

    // Get user from the token
    req.user = await User.findById(decoded.id).select('-password'); // Corrected to decoded.id

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Not authorized, token failed' });
    return; // Stop execution after sending error response
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: `User role ${req.user.role} is not authorized to access this route` });
    }
    next();
  };
};

export { protect, authorizeRoles };
