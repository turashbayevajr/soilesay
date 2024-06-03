module.exports = (req, res, next) => {
    const user = req.user; // Assuming req.user is set by your authentication middleware

    if (user && user.isAdmin) {
        next();
    } else {
        res.status(403).send({ message: 'Forbidden: Admins only' });
    }
};