exports.get404ErrorPage = (req, res, next) => {
    //res.status(404).send('<p> Page not found </p>');
    //res.status(404).sendFile(path.join(__dirname, './', 'views', 'error-page.html'));
    res.status(404).render('../views/error/not-found-error.ejs', { pageTitle: '404'});
}