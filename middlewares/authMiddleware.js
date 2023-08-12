const jwt = require('jsonwebtoken')
const User = require('../models/users')

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt
    
    if (token) {
        jwt.verify(token, 'gizli kelme', (err, decodedToken) => {
            if(err){ 
                console.log(err)
                res.redirect('/login')
            }else {
                console.log(decodedToken)
                next()
            }  
        })
    }else {
        res.redirect('/login')
    }
}

const checkUser = (req,res,next) =>  {
    const token = req.cookies.jwt

    if (token) {
        jwt.verify(token, 'gizli kelme', async (err, decodedToken) => {
            if(err){
                console.log(err)
                res.locals.user = null
                //The res.locals object is a container for values that are made available to the views rendered by the application.
                //In this case, res.locals.user is being used to store a user object, which could represent a user who is authenticated and has logged into the application.
            }else {
                console.log(decodedToken)
                let user = await User.findById(decodedToken.id)
                res.locals.user = user
                next()
            }  
        })
    }else {
        res.locals.user = null
        next()
    }
}

module.exports = {requireAuth, checkUser}