const jwt = require('jsonwebtoken');
const tokenSecret = process.env.TOKEN_SECRET;

exports.verifyToken = (req, res, next) => {
    const token = req.header.authorization
    if(!token) return res.status(403).json({message: 'No token provided'});
    else{
        jwt.verify(token.split(" ")[1], tokenSecret, (err, decoded) => {
            if(err) return res.status(500).json({message: 'Invalid token'});
            else{
                req.user = decoded.data;
                next();
            }
        })
    
    }
}