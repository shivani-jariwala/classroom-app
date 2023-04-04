const express = require('express')
const router = express.Router()
const deleteAssignController = require("../../controller/assignments/delete");
const {authMiddleware} = require("../../helpers/auth");

router.get('/',
    authMiddleware,
    deleteAssignController.deleteAssignment
)

module.exports = router