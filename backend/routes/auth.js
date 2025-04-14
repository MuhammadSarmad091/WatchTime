// middleware/auth.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'abcdef';

const authorize = (requiredRole) => {
  return (req, res, next) => {
    //Uncomment the next line to skip authentication
    //return next();
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token missing or invalid' });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      if (requiredRole && decoded.role !== requiredRole) {
        return res.status(403).json({ message: `Access denied. ${requiredRole} role required.` });
      }
      req.user = decoded;
      next();
    } catch (err) {
      console.error('JWT verification error:', err);
      res.status(401).json({ message: 'Invalid or expired token' });
    }
  };
};

module.exports = authorize;
