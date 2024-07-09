const Blog = require('./blog')
const fs = require('fs')
const path = require('path')

const createBlog = async(req, res) => {
    if(req.file && req.body.title.length > 2 
        && req.body.description.length > 2
        && req.body.category.length > 2)
    {
        await new Blog({
            title: req.body.title,
            category: req.body.category,
            image: `/img/blogs/${req.file.filename}`,
            description: req.body.description,
            author: req.user._id
        }).save()
        res.redirect(`/myBlogs/${req.user._id}`)
    }else{
        res.redirect('/new?error=1')
    }
}


const editBlog = async(req, res) => {
    if( req.body.title.length > 2 
        && req.body.description.length > 2
        && req.body.category.length > 2)
    {
        const blog = await Blog.findById(req.body.id)
        fs.unlinkSync(path.join(__dirname + '../../../public' + blog.image))
        await Blog.findByIdAndUpdate(req.body.id, {
            title: req.body.title,
            category: req.body.category,
            image: `/img/blogs/${req.file.filename}`,
            description: req.body.description,
            author: req.user._id
        })
        res.redirect('/myBlogs/' + req.user._id)
    }else{
        res.redirect(`/edit/${req.body.id}?error=1`)
    }
}

const deleteBlog = async(req, res) => {
    const blog = await Blog.findById(req.params.id)
    if(blog){
        fs.unlinkSync(path.join(__dirname + '../../../public' + blog.image))
        await Blog.deleteOne({_id : req.params.id})
        res.status(200).send('ok')
    }else{
        res.status(404).send('Not found')
    }
}

module.exports = {
    createBlog,
    editBlog,
    deleteBlog
}