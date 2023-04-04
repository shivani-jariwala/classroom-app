const express = require('express');
const router = express.Router();
const submissionRouter = require('./submit.js');
const assignmentDetailsRouter = require('./assignment-details.js');
const getAllAssignmentRouter = require('./get-all');

router.use('/submit', submissionRouter)
router.use('/get-assignment-details', assignmentDetailsRouter)
router.use('/get-all', getAllAssignmentRouter)

module.exports = router