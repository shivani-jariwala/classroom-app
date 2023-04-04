const HttpStatus = require("http-status-codes");
const db = require("../../db/user/submit");
const logger = require("../../log");

exports.submitAssignment = async (req, res) => {
  try {
    const { assignmentId, remark } = req.body;
    const { userId, type } = req.user;
    logger.debug({assignmentId,remark}, '[controller/user/submit.js] [params] [submitAssignment] ');
    
    //check the body details
    if (!assignmentId || !remark)
      return res.status(HttpStatus.BAD_REQUEST).json({
        errorMessage: "Incomplete details",
        message: "failure",
      });
    //check if the submission is made by student
    if (!req.user || type !== "student")
      return res.status(HttpStatus.UNAUTHORIZED).json({
        errorMessage: "Not allowed. Only student can make a submission",
        message: "failure",
      });

    //find the assignment
    const [assignment] = await db.findAssignment(assignmentId);

    //if the assignment is not found
    if(!assignment || assignment.length === 0) return res.status(HttpStatus.NOT_FOUND).json({
        errorMessage: "Assignment not found",
        message: "failure"
    });

    //check if the assignment is allotted to the current student
    if(!assignment[0].student_ids.includes(userId)) return res.status(HttpStatus.UNAUTHORIZED).json({
        errorMessage: "Not allowed. Only the assigned students can submit the assignment",
        message: "failure"
    });

    //check if the submission already exists for the given assignment id and student id
    const [submission] = await db.findSubmission(assignmentId, userId);
    
    if(submission && submission.length) return res.status(HttpStatus.CONFLICT).json({
        errorMessage: "Cannot make another submission for the same assignment",
        message: "failure"
    });

    //if everything's passed, submit the assignment
    await db.submitAssignment(assignmentId, userId, remark);

    return res
      .status(HttpStatus.OK)
      .json({
        message: "success",
      });
  } catch (err) {
    logger.error({err}, '[controller/user/submit.js] [submitAssignment] ');
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json(errors.randomError(err.message));
  }
};
