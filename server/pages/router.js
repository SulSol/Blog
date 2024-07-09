const express = require('express')
const router = express.Router();
const Categories = require('../Categories/Categories')
const User = require('../auth/user')
const Blog = require('../blogs/blog')
const Comment = require('../Comments/Comments')

router.get('/', async(req, res) => {
    const options = {}
    const categories = await Categories.findOne({key: req.query.categ})
    if(categories){
        options.category = categories._id
        res.locals.category = req.query.categ
    }
    let page = 0
    const limit = 2
    if(req.query.page && req.query.page > 0){
        page = req.query.page
    }

    if(req.query.search && req.query.search.length > 0){
        options.$or = [
            {
                title: new RegExp(req.query.search , 'i')
            }
        ]
        res.locals.search = req.query.search
    }

    const totalBlogs = await Blog.countDocuments(options)
    const allCategories = await Categories.find()
    const blogs = await Blog.find(options).limit(limit).skip(page*limit).populate('category').populate('author')

    const blogsWithCommentCount = await Promise.all(blogs.map(async (blog) => {
        const commentCount = await Comment.countDocuments({ blogId: blog._id });
        return { ...blog._doc, commentCount };
    }));

    res.render("index", {categories: allCategories, user: req.user ? req.user: {}, blogs: blogsWithCommentCount,
     pages: Math.ceil(totalBlogs / limit)})
})

router.get('/detail/:id', async(req, res) => {
    const comments = await Comment.find({blogId: req.params.id}).populate('authorId')
    const allCategories = await Categories.find()
    const blog = await Blog.findById(req.params.id).populate('category').populate('author')
    res.render("detail", {categories: allCategories, user: req.user ? req.user: {}, blog, comments})
})


router.get('/myBlogs/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    const blogs = await Blog.find({ author: req.params.id }).populate('category');
    
    const blogsWithCommentCount = await Promise.all(blogs.map(async (blog) => {
        const commentCount = await Comment.countDocuments({ blogId: blog._id });
        return { ...blog._doc, commentCount };
    }));

    if (user) {
        res.render("myBlogs", { user: user, loginUser: req.user, blogs: blogsWithCommentCount });
    } else {
        res.redirect('/not-found');
    }
});

router.get('/new' , async(req, res) => { 
    const allCategories = await Categories.find()
    res.render('new', {categories: allCategories, user: req.user ? req.user: {}})
})

router.get('/edit/:id' , async(req, res) => {
    const allCategories = await Categories.find()
    const blog = await Blog.findById(req.params.id)
    res.render('edit', {categories: allCategories, user: req.user ? req.user: {}, blog: blog})
})

router.get('/log' , (req, res)=>{
    res.render('log', {user: req.user ? req.user: {}})
})

router.get('/register' , (req, res)=>{
    res.render('register', {user: req.user ? req.user: {}})
})

router.get('/not-found', (req, res) => {
    res.render('notFound')
})

module.exports = router