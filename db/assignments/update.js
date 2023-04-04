const connection = require('../../database');
const logger = require('../../log');

exports.findAssignment = (id) => {
    logger.debug({id}, '[db/assignments/update.js] [findAssignment] ');
    const query = `SELECT * FROM assignment WHERE id = ? and deleted_at is null`;
    return connection.query(query, [id])
}

exports.updateAssignment = (id,updateObj) => {
    logger.debug({id,updateObj}, '[db/assignments/update.js] [updateAssignment] ');
    const query = `UPDATE assignment SET student_ids = ?, description = ?, published_at = ?, deadline = ?  WHERE id = ?`;
    return connection.query(query, [updateObj.s_ids,updateObj.desc,updateObj.published_at,updateObj.deadline,id])
}