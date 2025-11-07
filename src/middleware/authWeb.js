const jwt = require('jsonwebtoken');

const authMiddlewareWeb = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.redirect('/login');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.userEmail = decoded.email;
    next();
  } catch {
    res.clearCookie('token');
    return res.redirect('/login');
  }
};

module.exports = { authMiddlewareWeb };
