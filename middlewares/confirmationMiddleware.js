const jwt = require("jsonwebtoken");
const config = require("../config/index");

const checkConformationToken = (req, res, next) => {
  console.log("enetr in token check");
  let token = req.params.token; // Express headers are auto converted to lowercase
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
//   console.log(req.params.id);
const payload=jwt.verify(token, config.secret, {ignoreExpiration: true} );
  console.log(payload.email);
  if (token) {
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res.json({
          success: false,
          message: "Token is not valid"
        });
      } else {
        // if(payload.email===req.params.id){
          console.log("decode:"+decoded)
          req.decoded = decoded;
        next();
        // }else{
        //   console.log("token exist but use not exact");
        //   return res.json({
        //     success: false,
        //     message: "Token is valid user does not match" 
        //   });
        // }
        
      }
    });
  }
};

module.exports = {
  checkConformationToken: checkConformationToken
};
