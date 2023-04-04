/*
 *
 * Dependencies
 *
 * */
const bluebird = require('bluebird');
const mysql = require('mysql2/promise');
const nconf = require('nconf');
/*
 *
 * Config
 *
 * */
const dbConfig = nconf.get('dbConfig');
/*
 *
 * Connection Config
 *
 * */
const mysqlHost = dbConfig.host;
const mysqlUser = dbConfig.user;
const mysqlPassword = dbConfig.password;
const mysqlDb = dbConfig.database;
/*
 *
 * Connection Options
 *
 * */
const options = {
    connectionLimit: 50,
    host: mysqlHost,
    user: mysqlUser,
    password: mysqlPassword,
    database: mysqlDb,
    multipleStatements: true,
    Promise: bluebird,
};
/*
 *
 * Additional Config
 *
 * */
bluebird.longStackTraces();
/*
 *
 * Pool
 *
 * */
const pool = mysql.createPool(options);
/*
 *
 * Standard Errors
 *
 * */
const CONNECTION_LOST = 'PROTOCOL_CONNECTION_LOST';
const EPIPE = 'EPIPE';
/*
 *
 * Mysql Pool Wrapper
 * Handling connection errors
 *
 * */
const wrapper = {};
/*
 *
 * Query
 *
 * */
wrapper.query = (queryString, queryArgs) => {
    return pool.query(queryString, queryArgs).catch((err) => {
        // handle connection lost and fd errors
        if (err.code === CONNECTION_LOST || err.code === EPIPE) {
            return wrapper.query(queryString, queryArgs);
        }
        return Promise.reject(err);
    });
};
/*
 *
 * Escape
 * Connection
 *
 * */
wrapper.escape = (input) => pool.escape(input);
wrapper.getConnection = () => pool.getConnection();
/*
 *
 * Resolution
 *
 * */
module.exports = wrapper;
