import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import config from '../config/config.js';

const protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header (Bearer token)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // If no token in header, try getting it from cookie
  if (!token && req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
    return; // Stop execution if no token
  }

  // Check if JWT_SECRET is properly configured
  if (config.jwtSecret === 'your_jwt_secret') {
    console.error('ERROR: JWT_SECRET is not configured. Please set JWT_SECRET in your .env file in the backend directory.');
    res.status(500).json({ message: 'Server configuration error: JWT Secret not set.' });
    return;
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret);

    // Get user from the token
    req.user = await User.findById(decoded.id).select('-password'); // Corrected to decoded.id
    console.log('authMiddleware: req.user.role:', req.user.role); // NEW: Log user role

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Not authorized, token failed' });
    return; // Stop execution after sending error response
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    console.log('authorizeRoles: req.user:', req.user); // NEW: Log req.user
    console.log('authorizeRoles: allowed roles:', roles); // NEW: Log allowed roles
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: `User role ${req.user.role} is not authorized to access this route` });
    }
    next();
  };
};

export { protect, authorizeRoles };
