// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const likesArray = blogs.map(blog => blog.likes)
  const likeSum = likesArray.reduce((total, likes) => total + likes, 0)
  return likeSum
}

module.exports = {
  dummy,
  totalLikes
}