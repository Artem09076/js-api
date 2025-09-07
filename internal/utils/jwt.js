const jwt = require('jsonwebtoken');



const generateToken = (payload, JWT_SECRET, JWT_EXPIRES) => {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES
    });
};

const verifyToken = (token, JWT_SECRET) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
};



module.exports = {
    generateToken,
    verifyToken
};