// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const likesArray = blogs.map(blog => blog.likes)
  const likeSum = likesArray.reduce((total, likes) => total + likes, 0)
  return likeSum
}

const Blog = require('../models/blog')

// const initialBlogs = [
//   {
//     title: 'After Life',
//     author: 'Joan Didion',
//     url: 'https://www.nytimes.com/2005/09/25/magazine/after-life.html',
//     likes: 10
//   },
//   {
//     title: 'Why Go Out?',
//     author: 'Sheila Heti',
//     url: 'https://thoughtcatalog.com/sheila-heti/2013/07/why-go-out/',
//     likes: 100
//   },
// ]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  dummy,
  totalLikes,
  blogsInDb
}