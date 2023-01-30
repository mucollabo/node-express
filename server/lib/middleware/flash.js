module.exports = (req, res) => {
    // if there is a flash message
    // send to context, delete
    res.locals.flash = req.session.flash
    delete req.session.flash
    next()
}
