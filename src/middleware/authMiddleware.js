export function requireAuth(req, res, next) {
    // Checks if the user has a valid session or if the user is authenticated
    // If threre is no session or no userId in session, respond with 401 Unauthorized
    if (!req.session || !req.session.userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    // If authenticated, proceed to the next middleware/controller, without next() the function will hang
    next();
}