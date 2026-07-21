const jwt = require('jsonwebtoken')

function auth(req,res,next) {
    const authHeader = req.headers.authorization;

    if(!authHeader) {
        return res.status(401).json({
            message: "Token is missing"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid token"
        })
    }
}

module.exports = auth;