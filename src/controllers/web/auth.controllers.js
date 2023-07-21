export async function handlerShowLogin (req, res, next) {
    try {
        res.render('login', { title: 'LOG IN', loggedin: null, quantity: null })
    } catch (error) {
        next(error)
    }
}
