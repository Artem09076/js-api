class CommentHandlers {
    constructor(queries) {
        this.queries = queries
    }
    async getPostComments(req, res) {
        try {
            const postID = req.params.postID
            const comments = await this.queries.getCommentsByPostID(postID)
            res.status(200).json({comments: comments})
        } catch (error) {
            console.log(error);
            res.status(500).json({"error": "Internal server error"})
        }
    }

    async getComment(req, res) {
        try {
            const commentID = req.params.commentID
            const comment = await this.queries.getCommentByID(commentID)
            res.status(200).json({comment: comment})
        } catch (error) {
            console.log(error);
            res.status(500).json({"error": "Internal server error"})
        }
    }

    async createComment(req, res) {
        try {
            const { userID } = req.user
            const postID = req.params.postID
            const { content } = req.body
            const comment = await this.queries.createComment(content, postID, userID)
            res.status(200).json({comment: comment})
        } catch (error) {
            console.log(error);
            res.status(500).json({"error": "Internal server error"})            
        }
    }

    async deleteComment(req, res) {
        try {
            const commentID = req.params.commentID
            await this.queries.deleteCommentByID(commentID)
            res.status(204)
        } catch (error) {
            console.log(error);
            res.status(500).json({"error": "Internal server error"})
        }
    }

}


module.exports = CommentHandlers