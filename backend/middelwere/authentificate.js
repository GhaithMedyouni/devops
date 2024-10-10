const jwt = require('jsonwebtoken');
// Import your secret key from a configuration file
const dotenv = require('dotenv').config()
const verifyTokenMiddleware = (req, res, next) => {
    // Check if the Authorization header exists
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header is missing' });
    }

    // Extract the token from the Authorization header
    const token = authHeader.split(' ')[1];
    console.log(token)



    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Attach the decoded payload to the request object for further use
        req.user = decoded;
        next(); // Call the next middleware function
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = verifyTokenMiddleware;
