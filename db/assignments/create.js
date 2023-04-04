const connection = require('../../database');
const logger = require('../../log');

exports.createAssignment = (tId,sId,desc,pubAt,deadline) => {
    logger.debug({ tId,sId,desc,pubAt,deadline }, '[db/assignments/create.js] [createAssignment] ');
    const query = `INSERT INTO assignment (tutor_id, student_ids, description, published_at, deadline) VALUES (?, ?, ?, ?, ?);`;
    return connection.query(query, [tId,sId,desc,pubAt,deadline])
}