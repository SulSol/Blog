const isAuth = (req, res, next) => {
    if(req.user){
        next()
    }else{
        res.status(401).send('Not authorized')
    }
}

module.exports = {
    isAuth
}