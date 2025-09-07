class Config {
    constructor(path) {
        require("dotenv").config({path:path})
        this.dbName = process.env.DB_NAME
        this.dbUser = process.env.DB_USER
        this.dbPass = process.env.DB_PASS
        this.dbHost = process.env.DB_HOST
        this.dbPort = process.env.DB_PORT
        this.jwtSecret = process.env.JWT_SECRET
        this.jwtRefreshSecret = process.env.JWT_REFRESH_SECRET
        this.jwtExpires = process.env.JWT_EXPIRES
        this.jwtRefreshexpires = process.env.JWT_REFRESH_EXPIRES
    }
}

module.exports = Config



