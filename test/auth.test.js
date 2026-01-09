const request = require('supertest');
const app = require('../index.js')
const Queries = require('../internal/storage/db/db.js')
const db = new Queries()

let token = ''
let postID = null
let commentID = null
let userID = null

beforeAll(async () => { 
  await db.pool.query('DELETE FROM users')
  await db.pool.query('DELETE FROM comments')
  await db.pool.query('DELETE FROM posts')
  await db.pool.query("ALTER SEQUENCE users_id_seq RESTART WITH 1");
  await db.pool.query("ALTER SEQUENCE comments_id_seq RESTART WITH 1");
  await db.pool.query("ALTER SEQUENCE posts_id_seq RESTART WITH 1");
}
)

describe('Auth Handlers', () => {
  test('Register user', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({username: "johndoe", email: "johndoe@example.com", password: "secret123"})
    expect(res.statusCode).toBe(200)
    expect(res.body.data.user).toHaveProperty('username', 'johndoe')
    userID = res.body.data.user.id
  })

  test('Login user', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({email: "johndoe@example.com", password: "secret123"})
    
      expect(res.statusCode).toBe(200)
      expect(res.body).toHaveProperty('accessToken')
      token = res.body.accessToken
  })

});


describe('Post Handlers', () => {
  test('Create Post', async () => {
    const res = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({title: "Post title", content: "Post content"})
    expect(res.statusCode).toBe(201)
    expect(res.body.post).toHaveProperty('title', 'Post title')
    postID = res.body.post.id
  })

  test('Try create post without token', async () => {
    const res = await request(app)
      .post('/api/posts')
      .send({title: "Post title", content: "Post content"})
    expect(res.statusCode).toBe(401)
  })
  
  test('Get post by id', async () => {
    const res = await request(app)
      .get(`/api/posts/${postID}`)
    expect(res.statusCode).toBe(200)
    expect(res.body.post).toHaveProperty('title', 'Post title')
  })

  test('Get post by user id', async () => {
    const res = await request(app)
    .get(`/api/users/${userID}/posts`)
    expect(res.statusCode).toBe(200)
    expect(res.body.posts[0]).toHaveProperty('title', 'Post title')
  })
})


describe('Comment Handlers', () => {
  test('Create Comment', async () => {
    const res = await request(app)
    .post(`/api/posts/${postID}/comments`)
    .set('Authorization', `Bearer ${token}`)
    .send({content: 'Comment Content'})
    expect(res.statusCode).toBe(201)
    expect(res.body.comment).toHaveProperty('content', 'Comment Content')
    commentID = res.body.comment.id
  })
  test('Try create comment without token', async () => {
    const res = await request(app)
    .post(`/api/posts/${postID}/comments`)
    .send({content: 'Comment Content'})
    expect(res.statusCode).toBe(401)
  })
  test('Get comment by id', async () => {
    const res = await request(app)
    .get(`/api/comments/${commentID}`)
    expect(res.statusCode).toBe(200)
    expect(res.body.comment).toHaveProperty('content', 'Comment Content')
  })
}
)