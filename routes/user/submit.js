const express = require('express')
const router = express.Router()
const {authMiddleware} = require("../../helpers/auth");
const submitAssignController = require("../../controller/user/submit");

router.post('/',
    authMiddleware,
    submitAssignController.submitAssignment
)

module.exports = router