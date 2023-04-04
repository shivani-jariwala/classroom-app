const express = require('express')
const router = express.Router()
const updateAssignController = require("../../controller/assignments/update");
const {authMiddleware} = require("../../helpers/auth");

router.patch('/:id',
    authMiddleware,
    updateAssignController.updateAssignment
)

module.exports = router