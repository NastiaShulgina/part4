const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]

  const listWithManyBlogs = [
    {
      'title': '5 top tips on how to avoid procrastination',
      'author': 'James Bond',
      'url': 'https://www.futurelearn.com/info/blog/stop-procrastinating-top-tips',
      'likes': 185,
      'id': '6464de7a20ed84c2405bcd55'
    },
    {
      'title': 'Why Facts Don’t Change Our Minds',
      'author': 'James Clear',
      'url': 'https://jamesclear.com/why-facts-dont-change-minds',
      'likes': 35536,
      'id': '6464df2b20ed84c2405bcd58'
    },
    {
      'title': 'How to Fall Asleep Fast',
      'author': 'Austin Meadows',
      'url': 'https://www.sleepfoundation.org/sleep-hygiene/how-to-fall-asleep-fast',
      'likes': 2777,
      'id': '6464e24c6ef6adbd3bc88043'
    }
  ]

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithManyBlogs)
    expect(result).toBe(38498)})
})