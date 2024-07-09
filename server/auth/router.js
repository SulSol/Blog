const express = require('express')
const passport = require('passport')

const router = express.Router();
const {signup, signin, signout} = require('./controller')

router.post('/api/signup', signup)
router.post('/api/signin', passport.authenticate('local', {failureRedirect : '/log?error=1'}), signin)
router.get('/api/signout', signout)
router.get('/api/auth/google', passport.authenticate('google'), (req, res) => {
    res.redirect('/myBlogs/' + req.user._id)
})
router.get('/api/auth/github', passport.authenticate('github'), (req, res) => {
    res.redirect('/myBlogs/' + req.user._id)
})
module.exports = router