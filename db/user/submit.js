const connection = require('../../database');
const logger = require('../../log');

exports.findAssignment = (aId) => {
    logger.debug({aId}, '[db/user/submit.js] [findAssignment] ');
    const query = `SELECT * FROM assignment where id = ?`;
    return connection.query(query, [aId])
}

exports.findSubmission = (aId,sId) => {
    logger.debug({aId}, '[db/user/submit.js] [findSubmission] ');
    const query = `SELECT * FROM submission where student_id = ? and assignment_id = ? and deleted_at is null`;
    return connection.query(query, [sId,aId])
}

exports.submitAssignment = (aId,sId,remark) => {
    logger.debug({aId,sId,remark}, '[db/user/submit.js] [submitAssignment] ');
    const query = `INSERT INTO submission (student_id, assignment_id, remark) VALUES (?,?,?)`;
    return connection.query(query, [sId,aId,remark])
}