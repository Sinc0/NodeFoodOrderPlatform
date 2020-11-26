exports.get404ErrorPage = (req, res, next) => {

    res.status(404).render('../views/error/404');

}