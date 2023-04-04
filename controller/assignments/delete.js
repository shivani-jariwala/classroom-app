const HttpStatus = require("http-status-codes");
const db = require("../../db/assignments/delete.js");
const logger = require("../../log");

exports.deleteAssignment = async (req, res) => {
  try {
    const {assignment_id} = req.query;
    const { userId: tutorId, type } = req.user;
    logger.debug({assignment_id}, '[controller/assignments/delete.js] [params] ');
    

    // if assignment_id is invalid
    if (!assignment_id || !Number.isInteger(parseInt(assignment_id))) return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        errorMessage: "Incorrect assignment id",
        message: "failure",
      });

    // if no user or user type is not tutor
    if (!req.user || type !== "tutor") return res.status(HttpStatus.UNAUTHORIZED).json({
        errorMessage: "Not allowed",
        message: "failure",
      });

    // fetch assignment
    const [result] = await db.findAssignment(assignment_id);
    
    if(result.length === 0) return res.status(HttpStatus.NOT_FOUND).json({
        errorMessage: "Assignment not found",
        message: "failure",
    })

    if(result && result.length && result[0].tutor_id !== tutorId) return res.status(HttpStatus.UNAUTHORIZED).json({
        errorMessage: "Not allowed. Only the creator can delete the assignment",
        message: "failure",
    })

    if(result && result.length && result[0].tutor_id === tutorId) {
        await db.deleteAssignment(assignment_id);

        
    }
    return res
      .status(HttpStatus.OK)
      .json({
        message: "success",
      });
  } catch (err) {
    logger.error(
      { err },
      "[controller/assignments/create.js] [err] [createAssignment]"
    );
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json(errors.randomError(err.message));
  }
};
