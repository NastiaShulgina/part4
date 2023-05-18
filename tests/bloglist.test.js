// const listHelper = require('../utils/list_helper')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')

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