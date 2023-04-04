const express = require('express')
const router = express.Router()
const createAssignController = require("../../controller/assignments/create");
const {authMiddleware} = require("../../helpers/auth");

router.post('/',
    authMiddleware,
    createAssignController.createAssignment
)

module.exports = router