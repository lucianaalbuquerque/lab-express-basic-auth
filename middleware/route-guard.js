const isLoggedIn = (req,res,next) => {
    if (!req.session.currentUser) {
        return res.redirect('/login')
    }
    next() //if you dont use next in a middleware, the whole app will stop running here.
}

const isLoggedOut = (req,res,next) => {
    if (req.session.currentUser) {
        return res.redirect('/')
    }
    next() 
}

module.exports = { isLoggedIn, isLoggedOut };
