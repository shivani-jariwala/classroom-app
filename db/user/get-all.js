const connection = require('../../database');
const logger = require('../../log');

exports.getAllAssignments = (tutorId) => {
    logger.debug({tutorId}, '[db/user/get-all.js] [getAllAssignments] ');
    const query = `SELECT * FROM assignment where tutor_id = ?`;
    return connection.query(query, [tutorId])
}

exports.findAssignmentForStudent = (studentId) => {
    logger.debug({studentId}, '[db/user/get-all.js] [findAssignmentForStudent] ');
    const query = `SELECT * FROM assignment;`;
    return connection.query(query)
}

exports.getStudentSubmission = (studentId) => {
    logger.debug({studentId}, '[db/user/get-all.js] [getStudentSubmission] ');
    const query = `SELECT * FROM submission where student_id = ?`;
    return connection.query(query, [studentId])
}