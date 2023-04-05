const HttpStatus = require("http-status-codes");
const db = require("../../db/assignments/create");
const logger = require("../../log");
const errors = require('../../helpers/error');

exports.createAssignment = async (req, res) => {
  try {
    const { studentIds, description, publishedAt, deadline, id } = req.body;
    const { userId: tutorId, type } = req.user;
    if (!studentIds || !description || !publishedAt || !deadline)
      return res.status(HttpStatus.BAD_REQUEST).json({
        errorMessage: "Incomplete details",
        message: "failure",
      });
    // if no user found or user type is not tutor
    if (!req.user || type !== "tutor")
      return res.status(HttpStatus.UNAUTHORIZED).json({
        errorMessage: "Not allowed",
        message: "failure",
      });
    // deadline should not be after publish date
    if (new Date(deadline) < new Date(publishedAt))
      return res.status(HttpStatus.BAD_REQUEST).json({
        errorMessage: "Deadline can't be before publish date",
        message: "failure",
      });
    // if everythings fine then create assignment
    await db.createAssignment(
      id,
      tutorId,
      studentIds,
      description,
      publishedAt,
      deadline
    );
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
