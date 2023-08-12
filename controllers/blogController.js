const Blog = require('../models/blog')


const blog_index = (req, res) => {
    Blog.find().sort({createdAt: -1}).then((result) => res.render('index', {title: 'Anasayfa', blogs: result}))
}

const blog_id = (req, res) => {
    const id = req.params.id;

    Blog.findById(id).then((result) => res.render('blog', {title: "Detay", blog: result})).catch((err) =>  res.status(404).render('404', {title: 'Sayfa Bulunamadi'}))
}

module.exports = {
    blog_id,
    blog_index
}