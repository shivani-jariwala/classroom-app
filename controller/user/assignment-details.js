const HttpStatus = require("http-status-codes");
const db = require("../../db/user/assignment-details");
const logger = require("../../log");

exports.getAssignmentDetails = async (req, res) => {
  try {
    const assignmentId = req.params.aId;
    const { userId, type } = req.user;
    let result;
    logger.debug({assignmentId, type}, '[controller/user/assignment-details.js] [params] [getAssignmentDetails] ');
    
    //check the param details
    if (!assignmentId)
      return res.status(HttpStatus.BAD_REQUEST).json({
        errorMessage: "Incomplete details",
        message: "failure",
      });

    if(type === 'student'){
        try {
            [result] = await db.findSubmissionByStudents(assignmentId, userId)
        } catch (err) {
            logger.error({}, '[controller/user/assignment-details.js] [student] [getAssignmentDetails]');
            throw err;
        }
    } else {
        try {
            [result] = await db.findSubmissionForTutor(assignmentId)
        } catch (err) {
            logger.error({}, '[controller/user/assignment-details.js] [tutor] [getAssignmentDetails]');
            throw err;
        }

    }
    logger.debug({r:result}, '[controller/user/assignment-details.js] [result] ');
    return res
      .status(HttpStatus.OK)
      .json({
        message: "success",
        data : result && result.length ? result : []
      });
  } catch (err) {
    logger.error({err}, '[controller/user/assignment-details.js] [getAssignmentDetails] ');
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json(errors.randomError(err.message));
  }
};
