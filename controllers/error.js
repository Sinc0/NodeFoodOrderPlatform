exports.get404ErrorPage = (req, res, next) => {
    res.status(404).render('../views/404')
}