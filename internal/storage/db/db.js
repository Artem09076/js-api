const { Pool } = require('pg');

class Queries {
  constructor() {
    this.pool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASS,
      port: process.env.DB_PORT
    })
  }

  async createUser(username, email, passwordHash) {
          const result = await this.pool.query(
              "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *",
              [username, email, passwordHash]
          )
          
          return result.rows[0]
      }
  async userExists(email, username) {
    const result = await this.pool.query(
      "SELECT id FROM users WHERE email = $1 OR username = $2",
      [email, username]
    )
    return result.rows.length > 0
  }

  async userExistsByID(userID) {
    const result = await this.pool.query(
      "SELECT id FROM users WHERE id = $1",
      [userID]
    )
    return result.rows.length > 0
  }
  async findUserByEmail(email) {
          const result = await this.pool.query(
              "SELECT * FROM users WHERE email = $1",
              [email]
          )
          return result.rows[0]
      }
  
    async getUserByID(userID) {
      const result = await this.pool.query(
        "SELECT * FROM users WHERE id = $1",
        [userID]
      )
      
      return result.rows[0]
    }
  async createPost(title, content, userID) {
      const result = await this.pool.query(
        "INSERT INTO posts (title, content, user_id) VALUES ($1, $2, $3) RETURNING *",
        [title, content, userID]
      )
      return result.rows[0]
  }

  async getPosts(page, limit, userID) {
    const offset = limit * (page - 1)
    const result = await this.pool.query(
      "SELECT * FROM posts WHERE user_id = $1 OFFSET $2 LIMIT $3",
      [userID, offset, limit]
    )
    return result.rows
  }
  
  async getPostByID(postID) {
    const result = await this.pool.query(
      "SELECT * FROM posts WHERE id = $1",
      [postID]
    ) 
    return result.rows[0]
  }

  async createComment(content, postID, userID) {
    const result = await this.pool.query(
      "INSERT INTO comments (content, post_id, user_id) VALUES ($1, $2, $3) RETURNING *",
      [content, postID, userID]
    )
    return result.rows[0]
  }
  
  async getCommentsByPostID(postID) {
    const result = await this.pool.query(
      "SELECT * FROM comments WHERE post_id = $1",
      [postID]
    )
    return result.rows
  }

  async getCommentByID(commentID) {
    const result = await this.pool.query(
      "SELECT * FROM comments WHERE id = $1",
      [commentID]
    )
    return result.rows[0]
  }

  async deletePostByID(postID) {
    await this.pool.query(
      "DELETE FROM posts WHERE id = $1",
      [postID]
    )
  }

  async deleteCommentByID(commentID) {
    await this.pool.query(
      "DELETE FROM comments WHERE id = $1",
      [commentID]
    )
  }

  async getPostsByUserID(userID) {
    const result = await this.pool.query(
      "SELECT * FROM posts WHERE user_id = $1",
      [userID]
    )
    return result.rows
  }

}

module.exports = Queries