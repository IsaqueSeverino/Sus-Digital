const jwt = require('jsonwebtoken');

class JWTUtils {
  static generateToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    });
  }

  static verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
  }

  static decodeToken(token) {
    return jwt.decode(token);
  }
}

module.exports = JWTUtils;
