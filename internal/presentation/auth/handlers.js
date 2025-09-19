const { hashPassword, comparePassword } = require("../../utils/bcrypt.js")
const { generateToken, verifyToken } = require("../../utils/jwt.js")

class AuthHandlers {
    constructor(queries) {
        this.queries = queries
    }

    async register(req, res) {
        try {
            const { username, email, password } = req.body

            if (!username || !email || !password) {
                res.status(400).json({
                    message: "All fields are required"
                })
                return
            }

            if (password.length < 6) {
                res.status(400).json({
                    message: "Length password must be more 6"
                })
                return
            }

            if (!/\S+@\S+\.\S+/.test(email)) {
                res.status(400).json({
                    "message": "Invalid email"
                })
                return
            }
            const userExists = await this.queries.userExists(email, username)
            if (userExists) {
                res.status(409).json({
                    message: "User already exists"
                })
            }
            const hashedPassword = await hashPassword(password)

            const user = await this.queries.createUser(username, email, hashedPassword)

            const accessToken = generateToken({userID: user.id}, process.env.JWT_SECRET, process.env.JWT_EXPIRES)
            const refreshToken = generateToken({userID: user.id}, process.env.JWT_REFRESH_SECRET, process.env.JWT_REFRESH_EXPIRES)
            res.status(200).json({
                message: "User register success",
                data: {
                    user: user,
                    tokens: {
                         accessToken,
                         refreshToken
                    }
                }
             })
        } catch (error) {
            console.log(error);
            res.status(500).json({message: "Internal server error"})
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body

            if (!email || !password) {
                res.status(400).json({
                    message: "Email and password are required fields"
                })
                return
            }
            const user = await this.queries.findUserByEmail(email)
            const isPasswordValid = await comparePassword(password, user.password_hash)
            if (!isPasswordValid) {
                res.status(401).json({"message": "Bad email or password"})
                return 
            }
            const accessToken = generateToken({userID: user.id}, process.env.JWT_SECRET, process.env.JWT_EXPIRES)
            const refreshToken = generateToken({userID: user.id}, process.env.JWT_REFRESH_SECRET, process.env.JWT_REFRESH_EXPIRES)
            res.status(200).json({accessToken, refreshToken})
        } catch (error) {
            console.log(error)
            res.status(500).json({message: "Internal server error"})
        }
    }

    async refreshToken(req, res) {
        try {
            const {refreshToken} = req.body
            if (!refreshToken) {
                res.status(400).json({message: "Refresh token is required"})
                return
            }
            const decoded = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET)
            if (!decoded) {
                res.status(401).json({message: "Invalid refresh token"})
                return
            }
            const userExists = await this.queries.userExistsByID(decoded.userID)
             if (!userExists) {
                res.status(401).json({
                    success: false,
                    message: "User is not exists"
                })
                return
            }
            const newAccessToken = generateToken({userID: decoded.userID}, process.env.JWT_SECRET, process.env.JWT_EXPIRES)
            res.status(200).json({acessToken: newAccessToken})
        } catch (error) {
            console.log(error)
            res.status(500).json({message: "Internal server error"})
        }
    } 
    async getProfile(req, res) {
        try {
            const { userID } = req.user
            const user = await this.queries.getUserByID(userID)
            
            
            res.status(200).json({user:user})
        } catch (error) {
            console.log(error)
            res.status(500).json({message: "Internal server error"})
        }
    }
}

module.exports = AuthHandlers