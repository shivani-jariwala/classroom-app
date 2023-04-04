const connection = require('../../database');
const logger = require('../../log');

exports.findUserByEmail = (email) => {
    logger.debug({email}, '[auth/db/login.js] [findUserByEmail] ');
    const query = `SELECT * FROM users WHERE email = ?;`;
    return connection.query(query, [email])
}