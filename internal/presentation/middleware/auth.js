const {verifyToken} = require("../../utils/jwt.js")
const auth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                success: false, 
                message: 'Authorization require' 
            });
        }
        const token = authHeader.split(" ")[1]
        const decoded = verifyToken(token, process.env.JWT_SECRET)
        console.log(decoded);
        if (!decoded) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid or expired token' 
            });
        }
        req.user = decoded
        next()
    } catch (error) {
        res.status(401).json({message: 'Please authenticate'})
    }

}

module.exports = auth
