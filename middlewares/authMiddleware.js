const jwt = require("jsonwebtoken");
const config = require("../config/index");

const checkToken = (req, res, next) => {
  console.log("enetr in token check");
  let token = req.headers["x-access-token"] || req.headers["authorization"]; // Express headers are auto converted to lowercase
  if (!token) {
    return res.json({
      success: false,
      message: "This route requires authentication"
    });
  }
  if (token.startsWith("Bearer ")) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
    
  }
  console.log(token);
  console.log(req.params.id);
const id=jwt.verify(token, config.secret, {ignoreExpiration: true} );
  console.log(id.user);
  if (token) {
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res.json({
          success: false,
          message: "Token is not valid"
        });
      } else {
        if(id.user===req.params.id){
          console.log("decode:"+decoded)
          req.decoded = decoded;
        next();
        }else{
          console.log("token exist but use not exact");
          return res.json({
            success: false,
            message: "Token is valid user does not match" 
          });
        }
        
      }
    });
  }
};

module.exports = {
  checkToken: checkToken
};
