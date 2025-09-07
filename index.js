require("dotenv").config(".env")
const Queries = require("./internal/storage/db/db.js")
const db = new Queries()
const PostHandlers = require("./internal/presentation/post/handlers.js")
const AuthHandlers = require("./internal/presentation/auth/handlers.js")
const CommentHandlers = require("./internal/presentation/comment/handlers.js")
const authMiddleware = require("./internal/presentation/middleware/auth.js")
const postHandlers = new PostHandlers(db)
const authHandlers = new AuthHandlers(db)
const commentHandlers = new CommentHandlers(db)

const express = require('express')
const app = express()
const port = 8080

app.use(express.json())

app.post("/register", (req, res) => authHandlers.register(req, res))
app.post("/login", (req, res) => authHandlers.login(req, res))
app.post("/refresh", (req, res) => authHandlers.refreshToken(req, res))
app.get("/profile", (req, res, next) =>  authMiddleware(req, res, next), (req, res) => authHandlers.getProfile(req, res))

app.post('/api/posts', (req, res, next) =>  authMiddleware(req, res, next), (req, res) => postHandlers.createPost(req, res))
app.get('/api/posts', (req, res) =>  postHandlers.getPosts(req, res))
app.get('/api/posts/:postID', (req, res) => postHandlers.getPostByID(req, res))

app.post("/api/posts/:postID/comments", (req, res, next) =>  authMiddleware(req, res, next), (req, res) => commentHandlers.createComment(req, res))
app.get("/api/posts/:postID/comments", (req, res) => commentHandlers.getPostComments(req, res))
app.get("/api/comments/:commentID", (req, res) => commentHandlers.getComment(req, res))



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
