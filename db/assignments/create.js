const connection = require('../../database');
const logger = require('../../log');

exports.createAssignment = (id,tId,sId,desc,pubAt,deadline) => {
    logger.debug({ id,tId,sId,desc,pubAt,deadline }, '[db/assignments/create.js] [createAssignment] ');
    const query = `INSERT INTO assignment (id, tutor_id, student_ids, description, published_at, deadline) VALUES (?, ?, ?, ?, ?, ?);`;
    return connection.query(query, [id,tId,sId,desc,pubAt,deadline])
}