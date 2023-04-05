const HttpStatus = require("http-status-codes");
const db = require("../../db/assignments/update.js");
const logger = require("../../log");
const errors = require('../../helpers/error');

exports.updateAssignment = async (req, res) => {
  try {
    const {student_ids,description,published_at, deadline} = req.body;
    const assignment_id= req.params.id;
    const { userId: tutorId, type } = req.user;
    logger.debug({assignment_id}, '[controller/assignments/update.js] [params] [updateAssignment] ');    

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
    //check if the assignment is already published and the updation request is for deadline
    if (deadline !== undefined) {
        if (
            (
                published_at !== undefined &&
                new Date(deadline) < new Date(published_at )
            ) ||
            (
                published_at === undefined &&
                new Date(deadline) < new Date(result[0].published_at)
            )
        ) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                errorMessage: "Deadline cannot be before publish date",
                message: "failure",
            })
        }
    }
    
    //update the assignment
    const update = {
        s_ids: student_ids !== null ? student_ids : result[0].student_ids,
        desc: description !== null ? description : result[0].description,
        published_at: published_at !== null ? published_at : result[0].published_at,
        deadline: deadline !== null ? deadline : result[0].deadline,
    }
    await db.updateAssignment(assignment_id, update);

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
