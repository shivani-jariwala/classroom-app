const express = require('express')
const router = express.Router()
const {authMiddleware} = require("../../helpers/auth");
const getAllAssignmentController = require("../../controller/user/get-all");

router.get('/',
    authMiddleware,
    getAllAssignmentController.getAllAssignments
)

module.exports = router