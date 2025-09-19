class PostHandlers {
    constructor(queries) {
        this.queries = queries
    }
    async createPost(req, res) {
        try {
            const userID = req.user.userID
            const { title, content } = req.body
            const post = await this.queries.createPost(title, content, userID)
            res.status(201).json({post: post})
        } catch (error) {
            console.log(error);
            res.status(500).json({"error": "Internal server error"})
            
        }
    }
    async getPosts(req, res) {
        try {
            const page = parseInt(req.query.page) || 1
            const limit = parseInt(req.query.limit) || 1
            const userID = req.query.userID  
            if (!userID) {
                res.status(400).json({"error": "User id is required"})
                return
            }
            const result = await this.queries.getPosts(page, limit, userID)
            res.status(200).json({"posts": result})

        } catch (error) {
            console.log(error);
            
            if (error.message === "userID is required") {
                res.status(400).json({"error": error.message})
            } else {
                res.status(500).json({"error": "Internal server error"})
            }
        }
    }

    async getPostByID(req, res) {
        try {
            const postID = req.params.postID
            if (!postID) {
                res.status(400).json({"error": "Post ID is required"})
                return
            }
            const result = await this.queries.getPostByID(postID)
            res.status(200).json({"post": result})
        } catch (error) {
            if (error.message === "Post ID is required") {
                res.status(400).json({"error": error.message})
            } else {
                res.status(500).json({"error": "Internal server error"})
            }
        }
    }

    async deletePost(req, res) {
        try {
            const postID = req.params.postID
            if (!postID) {
                res.status(400).json({"error": "Post ID is required"})
                return
            }
            await this.queries.deletePostByID(postID)
            res.status(204)
        } catch {
            res.status(500).json({"error": "Internal server error"})
        }
    }

    async getUserPosts(req, res) {
        try {
            const userID = req.params.userID
            if (!userID) {
                res.status(400).json({"error": "User ID is required"})
                return
            }  
            const posts = await this.queries.getPostsByUserID(userID)
            res.status(200).json({"posts": posts})
        } catch (error) {
             res.status(500).json({"error": "Internal server error"})
        }
    }
}

module.exports = PostHandlers