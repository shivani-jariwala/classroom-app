const connection = require('../../database');
const logger = require('../../log');

exports.findSubmissionByStudents = (aId,sId) => {
    logger.debug({aId,sId}, '[db/user/assignment-details.js] [findSubmissionByStudents] ');
    const query = `SELECT s.remark as remark, a.description as assignmentDesc, published_at as assignmentPublishedAt, deadline as assignmentDeadline, u.email as tutorEmail FROM submission s INNER JOIN assignment a on a.id = s.assignment_id INNER JOIN users u on u.id = a.tutor_id where s.assignment_id = ? and s.student_id = ?`;
    return connection.query(query, [aId,sId])
}

exports.findSubmissionForTutor = (aId) => {
    logger.debug({aId}, '[db/user/assignment-details.js] [findSubmissionForTutor] ');
    const query = `SELECT s.remark as submissionRemark, a.description as assignmentDesc, published_at as assignmentPublishedAt, deadline as assignmentDeadline, u.email as studentEmail FROM submission s INNER JOIN assignment a on a.id = s.assignment_id INNER JOIN users u on u.id = s.student_id where s.assignment_id = ?`;
    return connection.query(query, [aId])
}