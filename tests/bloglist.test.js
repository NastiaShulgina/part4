const listHelper = require('../utils/list_helper')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')

const bcrypt = require('bcryptjs')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'After Life',
    author: 'Joan Didion',
    url: 'https://www.nytimes.com/2005/09/25/magazine/after-life.html',
    likes: 10
  },
  {
    title: 'Why Go Out?',
    author: 'Sheila Heti',
    url: 'https://thoughtcatalog.com/sheila-heti/2013/07/why-go-out/',
    likes: 100
  },
]

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})

test('blogs are returned in a correct amount and in the JSON format', async () => {
  const response = await api.get('/api/blogs')

  expect(response.status).toBe(200)
  expect(response.headers['content-type']).toMatch(/application\/json/)
  expect(response.body).toHaveLength(initialBlogs.length)
})

test('the unique identifier property of the blog posts is named id', async () => {
  const response = await api.get('/api/blogs')

  response.body.forEach((blog) => {
    expect(blog.id).toBeDefined()
    expect(blog._id).toBeUndefined()
  })
})

test('creating a new blog post', async () => {
  const newBlog = {
    title: 'The Book',
    author: 'Patrick Symmes',
    url: 'https://www.outsideonline.com/adventure-travel/destinations/south-america/book/',
    likes: 100,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const blogs = response.body

  expect(blogs.length).toBe(initialBlogs.length + 1)
})

test('deleting a blog post returns 204 status code', async () => {
  const blogsAtStart = await listHelper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await listHelper.blogsInDb()

  expect(blogsAtEnd).toHaveLength(
    initialBlogs.length - 1
  )

  const titles = blogsAtEnd.map(blog => blog.title)

  expect(titles).not.toContain(blogToDelete.title)
})

test('updating a blog post increases the number of likes', async () => {
  const blogs = await listHelper.blogsInDb()
  const blogToUpdate = blogs[0]

  const updatedBlog = { ...blogToUpdate, likes: blogToUpdate.likes + 1 }

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedBlog)
    .expect(200)

  const blogsAfterUpdate = await listHelper.blogsInDb()
  const updatedBlogAfterUpdate = blogsAfterUpdate.find(b => b.id === blogToUpdate.id)

  expect(updatedBlogAfterUpdate.likes).toBe(blogToUpdate.likes + 1)
})

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await listHelper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await listHelper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await listHelper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('expected `username` to be unique')

    const usersAtEnd = await listHelper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

})



// test('dummy returns one', () => {
//   const blogs = []

//   const result = listHelper.dummy(blogs)
//   expect(result).toBe(1)
// })

// describe('total likes', () => {
//   const listWithOneBlog = [
//     {
//       _id: '5a422aa71b54a676234d17f8',
//       title: 'Go To Statement Considered Harmful',
//       author: 'Edsger W. Dijkstra',
//       url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
//       likes: 5,
//       __v: 0
//     }
//   ]

//   const listWithManyBlogs = [
//     {
//       'title': '5 top tips on how to avoid procrastination',
//       'author': 'James Bond',
//       'url': 'https://www.futurelearn.com/info/blog/stop-procrastinating-top-tips',
//       'likes': 185,
//       'id': '6464de7a20ed84c2405bcd55'
//     },
//     {
//       'title': 'Why Facts Don’t Change Our Minds',
//       'author': 'James Clear',
//       'url': 'https://jamesclear.com/why-facts-dont-change-minds',
//       'likes': 35536,
//       'id': '6464df2b20ed84c2405bcd58'
//     },
//     {
//       'title': 'How to Fall Asleep Fast',
//       'author': 'Austin Meadows',
//       'url': 'https://www.sleepfoundation.org/sleep-hygiene/how-to-fall-asleep-fast',
//       'likes': 2777,
//       'id': '6464e24c6ef6adbd3bc88043'
//     }
//   ]

//   test('when list has only one blog, equals the likes of that', () => {
//     const result = listHelper.totalLikes(listWithOneBlog)
//     expect(result).toBe(5)
//   })

//   test('when list has only one blog, equals the likes of that', () => {
//     const result = listHelper.totalLikes(listWithManyBlogs)
//     expect(result).toBe(38498)})
// })

afterAll(async () => {
  await mongoose.connection.close()
})