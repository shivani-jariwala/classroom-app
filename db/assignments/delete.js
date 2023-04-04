const connection = require('../../database');
const logger = require('../../log');

exports.findAssignment = (id) => {
    logger.debug({ id }, '[db/assignments/delete.js] [findAssignment] ');
    const query = `SELECT * FROM assignment WHERE id = ?`;
    return connection.query(query, [id])
}

exports.deleteAssignment = (id) => {
    logger.debug({ id }, '[db/assignments/delete.js] [deleteAssignment] ');
    const query = `UPDATE assignment SET deleted_at = current_timestamp WHERE id = ?`;
    return connection.query(query, [id])
}