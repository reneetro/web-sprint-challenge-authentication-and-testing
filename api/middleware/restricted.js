const { JWT_SECRET } = require("../secrets");
const jwt = require('jsonwebtoken')

const User = require('../users/users-model')

module.exports = (req, res, next) => {
  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */
 const token = req.headers.authorization
 if(token) {
   jwt.verify(token, JWT_SECRET, async (err, decoded) => {
     if(err != null) {
       res.status(401).json({ message: 'token invalid'})
       return
     }

     next()
   })
 } else {
   res.status(401).json({ message: 'token required'})
 }
};
