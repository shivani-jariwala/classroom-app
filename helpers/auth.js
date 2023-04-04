const jwt = require('jsonwebtoken');
const nconf = require('nconf');
const jwtSecret = nconf.get('jwtSecret');
const expiresIn = nconf.get('expiresIn');

const generateAuthToken = (userId, email, type) => {
    const tokenPayload = {
        userId,
        email,
        type
    };
    return `JWT ${jwt.sign(tokenPayload, jwtSecret, {
        expiresIn: expiresIn,
    })}`;
};

const authMiddleware = (req, res, next) => {
    const authHeaders = req.headers['authorization']
    const token = authHeaders && authHeaders.split(" ")[1]
    console.log("token: ", token)
    if (token === null) return res.sendStatus(401) // in case token not found

    jwt.verify(token, 'ItAYYMOJmh5x2rLSrCfTDnMfM3POqQjo', (err, user) => {
        if (err) return res.sendStatus(403) // if token miss matched
        console.log("user",user)
        req.user = user
        next()
    })
}

module.exports = {
    generateAuthToken,
    authMiddleware
}