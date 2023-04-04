const express = require('express')
const router = express.Router()
const {authMiddleware} = require("../../helpers/auth");
const getDetailsController = require("../../controller/user/assignment-details");

router.get('/:aId',
    authMiddleware,
    getDetailsController.getAssignmentDetails
)

module.exports = router